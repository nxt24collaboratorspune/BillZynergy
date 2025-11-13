import pandas as pd


def agent03():
    merged_1 = pd.read_csv("./output/standard_Data.csv")
        
    merged_1['Impression_Mismatch'] = merged_1['Served_Impressions'] != merged_1['Planned_Impression']
    merged_1['Click_Mismatch'] = merged_1['Planned_Clicks'] != merged_1['Served_Clicks']
    
    # 2. Pricing Errors (assume you have media budget as the planned cost)
    merged_1['Pricing_Error'] = merged_1['Billed_Cost'] > merged_1['Media_budget']
    merged_1['Cost_Mismatch'] = (merged_1['Billed_Cost'] -  merged_1['Ad_Cost']) > 100
    
    
    # 4. Duplicate Charges (Vendor + Campaign + Date + Cost)
    merged_1['Duplicate_Charge'] = merged_1.duplicated(subset=['Vendor', 'Campaign_Id', 'Billed_Cost', 'Invoice_No'], keep=False)
    
    
    merged_1["Has_Discrepancy"] = ~(
        (merged_1["In_Campaign_Window"] == True) &
        (merged_1["Pricing_Error"] == False) &
        (merged_1["Duplicate_Charge"] == False) &
        (merged_1["Cost_Mismatch"] == False)
    )
    
    merged_1["Reconcilation_Amount"] = merged_1.apply(
        lambda row: abs(row["Billed_Cost"] - row["Media_budget"]) if row["Has_Discrepancy"] else 0,
        axis=1
    )
    merged_1['Has_Discrepancy'] = merged_1['Has_Discrepancy'].map({True: "Discrepancy", False: "No Discrepancy"})
    
    # Optional: Display only flagged rows
    Discrepancy_df_llm = merged_1
    
    Discrepancy_df_1 = Discrepancy_df_llm[['Invoice_No', 'Client_Name', 'Vendor', 'Campaign_Id','Billed_Cost', 'Ad_Cost', 'Served_Impressions','Served_Clicks', 'Media_budget', 'Planned_Impression','Has_Discrepancy',"Reconcilation_Amount"]]

    Discrepancy_df_1.to_csv("./output/Discrepancy.csv")
    Discrepancy_df_llm.to_csv("./output/Discrepancy_llm.csv")
    
    return Discrepancy_df_1.to_html()
