const q=(id,text,options,correct)=>({id,text,options,correct});
export const COMPANY_SETS={
 tcs:{name:'TCS-style Aptitude',minutes:10,negative:0.25,questions:[
  q('t1','A train 120 m long crosses a pole in 6 seconds. Its speed in km/h?',['60','72','80','54'],'72'),
  q('t2','Simple interest on 5000 at 8% per year for 3 years?',['1000','1200','1500','1240'],'1200'),
  q('t3','Average of 10, 20, 30, 40, 50?',['25','30','35','28'],'30'),
  q('t4','A finishes a job in 10 days, B in 15 days. Together they take (days)?',['5','6','7.5','8'],'6'),
  q('t5','Cost price 400, selling price 500. Profit percent?',['20%','25%','30%','15%'],'25%')]},
 infosys:{name:'Infosys-style Reasoning',minutes:10,negative:0.25,questions:[
  q('i1','Next number: 2, 6, 12, 20, 30, ?',['40','42','44','36'],'42'),
  q('i2','If A=1, B=2, C=3 ... then CAT = 24. What is DOG?',['24','26','28','22'],'26'),
  q('i3','A is the brother of B. B is the sister of C. C is what to A?',['Son','Sibling','Cousin','Uncle'],'Sibling'),
  q('i4','Odd one out: 3, 5, 7, 9, 11',['3','7','9','11'],'9'),
  q('i5','Ravi walks 3 km north, then 4 km east. Distance from the start?',['5 km','7 km','6 km','12 km'],'5 km')]},
 wipro:{name:'Wipro-style Quant',minutes:10,negative:0.25,questions:[
  q('w1','Father and son ages are in ratio 5:2 and the sum is 70. Son is?',['10','20','25','28'],'20'),
  q('w2','30% of a number is 45. The number is?',['135','150','120','175'],'150'),
  q('w3','A 800 item gets 15% discount. Final price?',['640','680','700','720'],'680'),
  q('w4','A tap fills a tank in 12 hours, another empties it in 18 hours. Both open, time to fill (hours)?',['30','36','6','24'],'36'),
  q('w5','An item costing 500 is sold at 20% loss. Selling price?',['400','380','420','450'],'400')]}
};