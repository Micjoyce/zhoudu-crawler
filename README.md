## export

mongoexport --host localhost --port 27017 --db zhoudu_article --collection books --type=csv --out text.csv --fields name,count,author,url