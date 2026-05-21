/**
 * Sample dataset for onboarding.
 * Realistic "Customer Orders Q4 2024" data with intentional quality issues:
 *  - ~8% null values in email and phone columns
 *  - 3 duplicate order_id values
 *  - 5 invalid email formats
 *  - 2 negative order_total values (validity issue)
 *  - Inconsistent date formats (ISO vs US)
 *  - One customer_tier value outside enum ("GOLD" vs "Gold"/"Silver"/"Bronze")
 *
 * NOTE: createSampleFile() uses browser APIs (Blob, File).
 * Only call it from "use client" components.
 */

export const SAMPLE_CSV_STRING = `order_id,customer_name,email,phone,order_date,order_total,customer_tier,region,product_sku,quantity
ORD-1001,Alice Johnson,alice.johnson@acme.com,+1-555-0101,2024-10-01,249.99,Gold,North,SKU-A001,2
ORD-1002,Bob Smith,bob.smith@techcorp.com,+1-555-0102,2024-10-02,89.50,Silver,South,SKU-B042,1
ORD-1003,Carol White,carol.white@example.com,+1-555-0103,2024-10-03,512.00,Gold,East,SKU-A001,4
ORD-1004,David Lee,david.lee@,+1-555-0104,2024-10-04,175.00,Bronze,West,SKU-C018,3
ORD-1005,Eve Martinez,,+1-555-0105,2024-10-05,320.75,Silver,North,SKU-D099,2
ORD-1006,Frank Brown,frank.brown@mail.com,,2024-10-06,95.00,Bronze,South,SKU-B042,1
ORD-1007,Grace Kim,grace.kim@startup.io,+1-555-0107,10/07/2024,440.00,Gold,East,SKU-A001,3
ORD-1008,Hank Wilson,hank.wilson@corp.net,+1-555-0108,2024-10-08,-49.99,Silver,West,SKU-E005,1
ORD-1009,Iris Chen,iris.chen@bigco.com,+1-555-0109,2024-10-09,680.00,Gold,North,SKU-F200,5
ORD-1010,Jake Turner,jake.turner@,+1-555-0110,2024-10-10,130.25,Bronze,South,SKU-C018,2
ORD-1011,Karen Davis,karen.davis@agency.com,+1-555-0111,2024-10-11,275.00,Silver,East,SKU-D099,3
ORD-1012,Leo Garcia,,+1-555-0112,2024-10-12,55.00,Bronze,West,SKU-B042,1
ORD-1013,Mia Thompson,mia.thompson@design.co,+1-555-0113,10/13/2024,990.00,GOLD,North,SKU-A001,8
ORD-1014,Noah Anderson,noah.anderson@media.com,+1-555-0114,2024-10-14,210.50,Silver,South,SKU-E005,2
ORD-1015,Olivia Harris,olivia.harris@finance.io,,2024-10-15,375.00,Gold,East,SKU-F200,3
ORD-1016,Paul Roberts,paul.roberts@logistics.com,+1-555-0116,2024-10-16,140.00,Bronze,West,SKU-C018,2
ORD-1017,Quinn Lewis,quinn@,+1-555-0117,2024-10-17,820.00,Gold,North,SKU-A001,6
ORD-1018,Rachel Young,rachel.young@health.net,+1-555-0118,2024-10-18,65.00,Bronze,South,SKU-B042,1
ORD-1019,Sam Walker,sam.walker@retail.com,+1-555-0119,2024-10-19,480.00,Silver,East,SKU-D099,4
ORD-1020,Tina Hall,tina.hall@edu.org,+1-555-0120,2024-10-20,195.00,Bronze,West,SKU-E005,2
ORD-1001,Alice Johnson,alice.johnson@acme.com,+1-555-0101,2024-10-21,249.99,Gold,North,SKU-A001,2
ORD-1021,Uma Scott,uma.scott@travel.com,+1-555-0121,2024-10-22,550.00,Gold,South,SKU-F200,4
ORD-1022,Victor Adams,,+1-555-0122,2024-10-23,75.00,Bronze,East,SKU-B042,1
ORD-1023,Wendy Baker,wendy.baker@law.com,+1-555-0123,2024-10-24,310.00,Silver,West,SKU-D099,2
ORD-1024,Xavier Clark,xavier.clark@tech.io,+1-555-0124,10/25/2024,730.00,Gold,North,SKU-A001,6
ORD-1025,Yara Evans,yara.evans@media.net,+1-555-0125,2024-10-26,45.00,Bronze,South,SKU-C018,1
ORD-1026,Zoe Foster,zoe.foster@studio.com,+1-555-0126,2024-10-27,890.00,Gold,East,SKU-F200,7
ORD-1027,Aaron Green,aaron.green@bank.com,+1-555-0127,2024-10-28,160.00,Silver,West,SKU-E005,2
ORD-1028,Bella Hughes,bella.hughes@fashion.co,,2024-10-29,420.00,Gold,North,SKU-D099,3
ORD-1029,Carlos Ingram,carlos.ingram@auto.com,+1-555-0129,2024-10-30,285.00,Bronze,South,SKU-C018,3
ORD-1030,Diana James,diana.james@pharma.net,+1-555-0130,2024-10-31,615.00,Silver,East,SKU-F200,5
ORD-1002,Bob Smith,bob.smith@techcorp.com,+1-555-0102,2024-11-01,89.50,Silver,South,SKU-B042,1
ORD-1031,Ethan King,ethan.king@cloud.io,+1-555-0131,2024-11-02,940.00,Gold,West,SKU-A001,7
ORD-1032,Fiona Lane,fiona@notvalidemail,+1-555-0132,2024-11-03,120.00,Bronze,North,SKU-C018,2
ORD-1033,George Mills,george.mills@energy.com,+1-555-0133,11/04/2024,380.00,Silver,South,SKU-D099,3
ORD-1034,Hannah Nash,hannah.nash@retail.org,,2024-11-05,255.00,Bronze,East,SKU-E005,3
ORD-1035,Ivan Owen,ivan.owen@saas.com,+1-555-0135,2024-11-06,710.00,Gold,West,SKU-F200,6
ORD-1036,Julia Park,julia.park@consulting.net,+1-555-0136,2024-11-07,95.00,Bronze,North,SKU-B042,1
ORD-1037,Kevin Quinn,kevin.quinn@fintech.io,+1-555-0137,2024-11-08,-29.99,Gold,South,SKU-A001,1
ORD-1038,Laura Reed,laura.reed@nonprofit.org,+1-555-0138,2024-11-09,175.00,Silver,East,SKU-D099,2
ORD-1039,Marcus Stone,,+1-555-0139,2024-11-10,830.00,Gold,West,SKU-F200,6
ORD-1040,Nina Turner,nina.turner@agency.com,+1-555-0140,2024-11-11,340.00,Silver,North,SKU-E005,4
ORD-1003,Carol White,carol.white@example.com,+1-555-0103,2024-11-12,512.00,Gold,East,SKU-A001,4
ORD-1041,Oscar Upton,oscar.upton@trade.com,+1-555-0141,2024-11-13,60.00,Bronze,South,SKU-C018,1
ORD-1042,Penny Vance,penny.vance@design.io,+1-555-0142,2024-11-14,490.00,Silver,West,SKU-D099,4
ORD-1043,Quincy Ward,quincy.ward@legal.net,+1-555-0143,11/15/2024,655.00,Gold,North,SKU-F200,5
ORD-1044,Rose Xu,rose.xu@tech.com,+1-555-0144,2024-11-16,215.00,Bronze,South,SKU-B042,2
ORD-1045,Sean Young,sean.young@startup.co,+1-555-0145,2024-11-17,780.00,Gold,East,SKU-A001,6
ORD-1046,Tara Zhang,tara.zhang@hr.com,+1-555-0146,2024-11-18,110.00,Bronze,West,SKU-C018,2
ORD-1047,Ursula Abbott,ursula.abbott@media.com,+1-555-0147,2024-11-19,395.00,Silver,North,SKU-E005,4
ORD-1048,Vincent Bell,vincent.bell@finance.io,,2024-11-20,560.00,Gold,South,SKU-F200,4
ORD-1049,Wanda Cruz,wanda.cruz@ecom.net,+1-555-0149,2024-11-21,85.00,Bronze,East,SKU-B042,1
ORD-1050,Xavier Dean,xavier.dean@corp.com,+1-555-0150,2024-11-22,1200.00,Gold,West,SKU-A001,10`;

/** Creates a browser File object from the sample CSV string. Browser-only. */
export function createSampleFile(): File {
  const blob = new Blob([SAMPLE_CSV_STRING], { type: "text/csv" });
  return new File([blob], "customer_orders_sample.csv", { type: "text/csv" });
}
