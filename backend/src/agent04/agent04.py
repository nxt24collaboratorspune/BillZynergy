import os
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
import pandas as pd
from datetime import datetime
 
# Set OpenAI API Key
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

def agent04(): 
    # Initialize LLM
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0.3
    )
    
    # Load your media bill invoice discrepancy dataframe
    df = pd.read_csv("./output/Discrepancy_llm.csv")
    
    # Prepare data summary
    data_summary = f"""
    MEDIA BILL INVOICE DISCREPANCY DATA
    
    Total Invoices Analyzed: {len(df)}
    Invoices with Discrepancies: {df['Has_Discrepancy'].sum()}
    
    FINANCIAL SUMMARY:
    - Total Billed Amount: ${df['Billed_Cost'].sum():,.2f}
    - Total Actual Ad Cost: ${df['Ad_Cost'].sum():,.2f}
    - Cost Variance: ${abs(df['Billed_Cost'].sum() - df['Ad_Cost'].sum()):,.2f}
    - Total Media Budget: ${df['Media_budget'].iloc[0]:,.2f}
    
    DISCREPANCY BREAKDOWN:
    - Cost Mismatches: {df['Cost_Mismatch'].sum()} invoices
    - Impression Mismatches: {df['Impression_Mismatch'].sum()} invoices
    - Click Mismatches: {df['Click_Mismatch'].sum()} invoices
    - Pricing Errors: {df['Pricing_Error'].sum()} invoices
    - Duplicate Charges: {df['Duplicate_Charge'].sum()} invoices
    
    DETAILED INVOICE DATA:
    {df.to_string(index=False)}
    """
    
    # Define Agent
    media_bill_analyst = Agent(
        role="Media Bill Invoice Discrepancy Analyst",
        goal="Analyze media billing invoices, identify discrepancies between billed amounts and actual ad costs, and generate actionable reconciliation reports",
        backstory="""You are a senior financial analyst specializing in digital media billing
        and invoice reconciliation. You have extensive experience working with major ad platforms
        (Google Ads, Facebook Ads, TikTok Ads, etc.) and understand the complexities of media
        buying, impression/click tracking, and billing discrepancies. You excel at:
        - Identifying cost variances between vendor invoices and platform-reported costs
        - Analyzing impression and click delivery against planned metrics
        - Detecting pricing errors, duplicate charges, and billing anomalies
        - Providing clear explanations and actionable resolutions for finance teams
        Your reports enable quick reconciliation and prevent revenue leakage.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )
    
    # Define Task
    invoice_analysis_task = Task(
        description=f"""Analyze the following media bill invoice discrepancy data and generate
        a comprehensive reconciliation report in HTML-friendly format:
    
    {data_summary}
    
    Your analysis must cover:
    
    1. **EXECUTIVE SUMMARY**
    - Overview of invoice discrepancies found
    - Total financial impact and variance percentage
    - Critical issues requiring immediate attention
    - Vendor-wise discrepancy summary
    
    2. **INVOICE-LEVEL ANALYSIS**
    For each invoice record, provide:
    - Invoice Number and Client details
    - Vendor and Campaign information
    - Cost Analysis:
        * Billed Cost vs Actual Ad Cost
        * Variance amount and percentage
        * Impact on media budget utilization
    - Delivery Analysis:
        * Served vs Planned Impressions (variance %)
        * Served vs Planned Clicks (variance %)
        * Campaign performance assessment
    
    3. **DISCREPANCY CATEGORIZATION**
    - **Cost Mismatches**: Explain why billed cost differs from ad cost
    - **Impression Mismatches**: Analyze under/over-delivery of impressions
    - **Click Mismatches**: Analyze click delivery variances
    - **Pricing Errors**: Identify incorrect pricing or rate issues
    - **Duplicate Charges**: Flag any duplicate billing instances
    
    4. **ROOT CAUSE ANALYSIS**
    Provide reasoned explanations:
    - Vendor billing system issues
    - Campaign pacing and delivery problems
    - Data synchronization delays
    - Contract rate vs actual rate discrepancies
    - Platform reporting inconsistencies
    
    5. **FINANCIAL IMPACT ASSESSMENT**
    - Total overbilled/underbilled amount
    - Budget variance analysis
    - Client billing impact
    - Potential refunds or adjustments needed
    
    6. **RECOMMENDED RESOLUTIONS**
    For each discrepancy type, provide:
    - Specific action items (e.g., "Request credit memo from TikTok Ads for Invoice #1234769")
    - Priority level (Critical/High/Medium/Low)
    - Responsible party (Finance Team/Media Team/Vendor)
    - Expected resolution timeline
    - Required documentation
    
    7. **PREVENTIVE MEASURES**
    - Invoice validation process improvements
    - Automated reconciliation checks to implement
    - Vendor communication protocols
    - Monthly reconciliation best practices
    - System integration recommendations
    
    Format the report professionally with clear sections and actionable insights.""",
        agent=media_bill_analyst,
        expected_output="""A comprehensive media bill invoice discrepancy report containing:
        - Executive summary with key findings
        - Detailed invoice-level analysis with financial impact
        - Root cause explanations for each discrepancy type
        - Prioritized, actionable resolution steps
        - Preventive measures for future billing cycles
        All formatted professionally for immediate use by finance and media teams."""
    )
    
    # Create Crew
    crew = Crew(
        agents=[media_bill_analyst],
        tasks=[invoice_analysis_task],
        process=Process.sequential,
        verbose=False
    )
    
    def convert_to_html(report_content, df):
        """Convert report to HTML format"""
    
        # Generate current date
        report_date = datetime.now().strftime("%B %d, %Y")
    
        # Create summary table
        summary_table = f"""
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Total Invoices Analyzed</td>
                <td>{len(df)}</td>
            </tr>
            <tr>
                <td>Invoices with Discrepancies</td>
                <td>{df['Has_Discrepancy'].sum()}</td>
            </tr>
            <tr>
                <td>Total Billed Amount</td>
                <td>${df['Billed_Cost'].sum():,.2f}</td>
            </tr>
            <tr>
                <td>Total Actual Ad Cost</td>
                <td>${df['Ad_Cost'].sum():,.2f}</td>
            </tr>
            <tr>
                <td>Cost Variance</td>
                <td>${abs(df['Billed_Cost'].sum() - df['Ad_Cost'].sum()):,.2f}</td>
            </tr>
        </table>
        """
    
        # Create invoice details table
        invoice_table = "<table><tr>"
        for col in ['Invoice_No', 'Client_Name', 'Vendor', 'Campaign_Id', 'Billed_Cost', 'Ad_Cost', 'Cost_Mismatch']:
            invoice_table += f"<th>{col.replace('_', ' ')}</th>"
        invoice_table += "</tr>"
    
        for _, row in df.iterrows():
            invoice_table += "<tr>"
            for col in ['Invoice_No', 'Client_Name', 'Vendor', 'Campaign_Id', 'Billed_Cost', 'Ad_Cost', 'Cost_Mismatch']:
                value = row[col]
                if col in ['Billed_Cost', 'Ad_Cost']:
                    value = f"${value:,.2f}"
                invoice_table += f"<td>{value}</td>"
            invoice_table += "</tr>"
        invoice_table += "</table>"
    
        # Convert markdown-style formatting to HTML
        report_html = report_content.replace('**', '<strong>').replace('**', '</strong>')
        report_html = report_html.replace('\n\n', '</p><p>')
        report_html = report_html.replace('\n- ', '<br>• ')
    
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page {{
                    size: A4;
                    margin: 2cm;
                }}
                body {{
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 100%;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    margin-bottom: 30px;
                    border-radius: 5px;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: bold;
                }}
                .header p {{
                    margin: 10px 0 0 0;
                    font-size: 14px;
                    opacity: 0.9;
                }}
                .section {{
                    margin-bottom: 25px;
                    page-break-inside: avoid;
                }}
                .section h2 {{
                    color: #667eea;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                    font-size: 20px;
                }}
                .section h3 {{
                    color: #764ba2;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    font-size: 16px;
                }}
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                th {{
                    background-color: #667eea;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-weight: bold;
                }}
                td {{
                    padding: 10px 12px;
                    border-bottom: 1px solid #ddd;
                }}
                tr:nth-child(even) {{
                    background-color: #f9f9f9;
                }}
                tr:hover {{
                    background-color: #f5f5f5;
                }}
                .highlight {{
                    background-color: #fff3cd;
                    padding: 15px;
                    border-left: 4px solid #ffc107;
                    margin: 15px 0;
                }}
                .footer {{
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #ddd;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }}
                p {{
                    margin: 10px 0;
                }}
                strong {{
                    color: #667eea;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Media Bill Invoice Discrepancy Report</h1>
                <p>Generated on {report_date}</p>
                <p>Finance Department</p>
            </div>
        
            <div class="section">
                <h2>📈 Financial Summary</h2>
                {summary_table}
            </div>
        
            <div class="section">
                <h2>📋 Invoice Details</h2>
                {invoice_table}
            </div>
        
            <div class="section">
                <h2>📝 Detailed Analysis</h2>
                <p>{report_html}</p>
            </div>
        
            <div class="footer">
                <p>This report is confidential and intended for internal use only.</p>
            </div>
        </body>
        </html>
        """
    
        return html_content
 
# Execute
# if __name__ == "__main__":
    print("="*80)
    print("MEDIA BILL INVOICE DISCREPANCY ANALYSIS")
    print("="*80)
    print("\nAnalyzing invoices and generating report...\n")
   
    result = crew.kickoff()
   
    print("\n" + "="*80)
    print("DISCREPANCY REPORT GENERATED")
    print("="*80)
    print("\n" + str(result))
   
    # Convert to HTML
    html_content = convert_to_html(str(result), df)
   
    # # Save as HTML
    # html_filename = f"Media_Bill_Discrepancy_Report.html"
    # with open(html_filename, 'w', encoding='utf-8') as f:
    #     f.write(html_content)
   
    # print(f"\n✓ HTML Report saved to '{html_filename}'")
    return html_content