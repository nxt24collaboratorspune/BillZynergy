import os
import json
from glob import glob
from pathlib import Path
from unittest import result
 
# Third Party Imports
from crewai import Agent, Task, Crew, Process, tools
from crewai_tools import FileWriterTool
import pandas as pd
import pdfplumber
 

 
def parser_agent():
    @tools.tool("FileParser")
    def file_parser(file_path: str) -> str:
        """A simple calculator tool that evaluates math expressions."""
        try:
            """
            Parse a file based on its extension and return its contents.
        
            Returns:
                - str for PDFs (extracted text)
                - list[dict] for CSV / Excel / JSON (tabular or structured data)
                - str message for unsupported formats
            """
            # Safely get extension in lowercase (e.g., ".pdf")
            _, ext = os.path.splitext(file_path)
            ext = ext.lower()
    
            # TXT (plain text files)
            if ext == ".txt":
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        return f.read()
                except Exception as e:
                    return f"Error reading TXT file: {e}"
        
            # PDF
            elif ext == ".pdf":
                try:
                    with pdfplumber.open(file_path) as pdf:
                        text = ""
                        for page in pdf.pages:
                            page_text = page.extract_text()
                            if page_text:
                                text += page_text + "\n"
                    return text.strip()
                except Exception as e:
                    return f"Error reading PDF: {e}"
        
            # CSV
            if ext == ".csv":
                try:
                    df = pd.read_csv(file_path)
                    return df.to_dict(orient="records")
                except Exception as e:
                    return f"Error reading CSV: {e}"
        
            # Excel (common extensions)
            if ext in [".xls", ".xlsx"]:
                try:
                    df = pd.read_excel(file_path)
                    return df.to_dict(orient="records")
                except Exception as e:
                    return f"Error reading Excel file: {e}"
        
            # JSON
            if ext == ".json":
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        return json.load(f)
                except Exception as e:
                    return f"Error reading JSON: {e}"
    
            # If none matched
            return f"Unsupported file format: {ext}"
        except Exception as e:
            return f"Error: {str(e)}"
    file_writer_tool = FileWriterTool()
    
    # Create crew agent and task for reading unstructured data and media spend tables
    review_agent = Agent(
        role="Invoice Review Analyst",
        goal="Produce audit-ready structured CSV datasets from heterogeneous advertising invoices while preserving every factual detail from the source document.",
        backstory="You are a senior media finance analyst who routinely reconciles vendor invoices against booking systems. You interrogate every document carefully, capture only explicitly stated values, and highlight any gaps that could affect downstream reporting.",
        tools=[file_parser, file_writer_tool],
        verbose=True
    )
 
 
 
    review_task = Task(
        description="""You are reading the file located at {file_path} Using FileParser. Follow these steps:
        KEEP THE CSV HEADER EXACTLY AS SPECIFIED if there are trailing space or : in header pls keep it.
    1. Use the FileParser tool to read the document and confirm the detected format.
    2. Emit RFC4180-compliant CSV text with a single header row followed by line entries.
    3. Save output.csv and a metadata.json file (containing extraction summary, anomalies, and open questions) to {out_path} via FileWriterTool.
    4. Return a concise status message or an error explanation if processing fails.""",
        expected_output="RFC4180-compliant CSV text with header row and one line per cost entry, plus metadata.json saved via FileWriterTool summarizing extraction decisions and unresolved questions.",
        agent=review_agent,        
    )
 
    crew = Crew(agents=[review_agent], tasks=[review_task], process=Process.sequential)
 
    crew.kickoff(
        inputs={
            "file_path": str(glob("./upload/*")[0]),
            "out_path": "./output/"
        }
    )
