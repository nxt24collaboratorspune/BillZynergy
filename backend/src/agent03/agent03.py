import pandas as pd


def agent03():
    merged_1 = pd.read_csv("./output/standard_Data.csv")
    merged_1['Impression_Mismatch'] = merged_1['Served_Impressions'] != merged_1['Planned_Impression']
    merged_1['Click_Mismatch'] = merged_1['Planned_Clicks'] != merged_1['Served_Clicks']
    
    # 2. Pricing Errors (assume you have media budget as the planned cost)
    merged_1['Pricing_Error'] = merged_1['Billed_Cost'] > merged_1['Media_budget']
    merged_1['Cost_Mismatch'] = merged_1['Billed_Cost'] != merged_1['Ad_Cost']
    
    
    # 4. Duplicate Charges (Vendor + Campaign + Date + Cost)
    merged_1['Duplicate_Charge'] = merged_1.duplicated(subset=['Vendor', 'Campaign_Id', 'Billed_Cost', 'Invoice_No'], keep=False)
    
    # Final overall flag
    merged_1['Has_Discrepancy'] = merged_1[['In_Campaign_Window','Pricing_Error', 'Duplicate_Charge']].any(axis=1)
    
    # Optional: Display only flagged rows
    Discrepancy_df_llm = merged_1[merged_1['Has_Discrepancy'] == True]
    
    Discrepancy_df_1 = Discrepancy_df_llm[['Invoice_No', 'Client_Name', 'Vendor', 'Campaign_Id','Billed_Cost', 'Ad_Cost', 'Served_Impressions','Served_Clicks', 'Media_budget', 'Planned_Impression','Has_Discrepancy']]
    Discrepancy_df_1.to_csv("./output/Discrepancy.csv")
    Discrepancy_df_llm.to_csv("./output/Discrepancy_llm.csv")
    
    return Discrepancy_df_llm.to_html()
