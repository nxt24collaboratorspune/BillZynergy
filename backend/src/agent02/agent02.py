import pandas as pd
from fuzzywuzzy import process


def agent02():
    invoice = pd.read_csv(r".\output\output.csv")
    mediaplan = pd.read_excel(r".\data\Media_Plan_Client1.xlsx")
    adlogs = pd.read_csv(r".\data\Ad logs.csv")
    
    # Perform fuzzy matching
    selected_columns = {}
    invoice_selected_col = ["Invoice No: ", "Client Name","Date of invoice",'Vendor', 'Campaign Id', 'Bill ($)']
    for target in invoice_selected_col:
        match, score = process.extractOne(target, invoice.columns)
        if score > 80:  # You can adjust this threshold
            selected_columns[target] = match
    
    # Create a new DataFrame with matched columns, renaming to desired names
    invoice_selected = invoice[list(selected_columns.values())].rename(columns={v: k for k, v in selected_columns.items()})
    
    
    # Perform fuzzy matching
    selected_columns = {}
    mediaplan_selected_col = ['Client_ID', 'vendor',  'Impressions.', 'Clicks.', 'Billed Amount']
    for target in mediaplan_selected_col:
        match, score = process.extractOne(target, mediaplan.columns)
        if score > 80:  # You can adjust this threshold
            selected_columns[target] = match
    
    # Create a new DataFrame with matched columns, renaming to desired names
    media_plan_selected = mediaplan[list(selected_columns.values())].rename(columns={v: k for k, v in selected_columns.items()})
    
    
    # Perform fuzzy matching
    selected_columns = {}
    adlogs_selected_col =['Client_ID', "Date",'Platform', 'Campaign Id','Impressions', 'Clicks', 'Gross Cost',]
    for target in adlogs_selected_col:
        match, score = process.extractOne(target, adlogs.columns)
        if score > 80:  # You can adjust this threshold
            selected_columns[target] = match
    
    # Create a new DataFrame with matched columns, renaming to desired names
    ad_logs_selected = adlogs[list(selected_columns.values())].rename(columns={v: k for k, v in selected_columns.items()})
    
    
    # Standardize column names for merging
    invoice_selected.columns = ['Invoice_No',"Client_Name","Date",'Vendor', 'Campaign_Id', 'Bill_Cost']
    
    invoice_selected
    
    media_plan_selected.columns = ['Client_Name', 'Vendor',
                                    'Impressions', 'Clicks', 'Media_budget']
    ad_logs_selected.columns = ['Client_Name', "Date",'Vendor', 'Campaign_Id',
                                'Impressions', 'Clicks', 'Ad_Cost']
    
    ad_logs_selected["Date"] =pd.to_datetime(ad_logs_selected["Date"])
    invoice_selected["Date"] =pd.to_datetime(invoice_selected["Date"])
    
    
    ad_logs_selected_1 = ad_logs_selected[ad_logs_selected["Date"]<= invoice_selected["Date"][0]]
    # Inner join invoice and ad_logs on Client_Name, Vendor, Campaign_Id  
    merged = pd.merge(invoice_selected, ad_logs_selected,  
                    on=['Client_Name', 'Vendor', 'Campaign_Id'],  
                    how='inner')
    
    
    # Clean all columns - remove $, commas, and other symbols  
    numeric_cols = ['Bill_Cost', 'Impressions', 'Clicks', 'Ad_Cost']  
    
    for col in numeric_cols:  
        merged[col] = merged[col].astype(str).str.replace('[\$,]', '', regex=True)  
        merged[col] = pd.to_numeric(merged[col], errors='coerce')
    
    merged.drop(columns=["Date_y"],inplace=True)
    
    merged.rename(columns = {"Date_x" : "Date"},inplace=True)
    
    # Aggregate by Client_Name, Vendor, Campaign_Id  
    merged = merged.groupby(["Invoice_No",'Client_Name', "Date",'Vendor', 'Campaign_Id']).agg({  
        'Bill_Cost': 'sum',  
        'Ad_Cost': 'sum' ,
        'Impressions': 'sum',  
        'Clicks': 'sum'
    }).reset_index()
    
    merged.columns=["Invoice_No","Client_Name","Date","Vendor","Campaign_Id","Billed_Cost","Ad_Cost","Served_Impressions","Served_Clicks"]
    
    
    # Aggregate by Client_Name, Vendor, Campaign_Id  
    media_plan_selected_1 = media_plan_selected.groupby(['Client_Name','Vendor']).agg({  
        'Media_budget': 'sum',  
        'Impressions': 'sum',  
        'Clicks': 'sum'
    }).reset_index()
    
    media_plan_selected_1.columns=[ "Client_Name","Vendor","Media_budget","Planned_Impression","Planned_Clicks"]
    
    merged_1 = pd.merge(merged, media_plan_selected_1,  
                    on=['Client_Name', 'Vendor'],  
                    how='inner')
    merged_1.to_csv(r".\output\standard_Data.csv")

    return merged_1.to_html()
