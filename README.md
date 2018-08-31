# pax
Visualizing Peace

A Data Visualization Project for the Political Settlements Research Programme (http://www.politicalsettlements.org/)
By Lucy Havens (Centre for Design Informatics, University of Edinburgh) and Mengting Bao (School of Informatics, University of Edinburgh)

Data Source: Peace Agreements Database (PA-X) - www.peaceagreements.org/search
Documentation: https://paxviz.wordpress.com/


# PA-X Codebook Excerpts 
(as relevant to visualizations - for complete Codebook visit www.peaceagreements.org)

Con: Country/Entity
Where the conflict originated, has territorial element, or relates to


Reg: Region
Where conflict in the agreement takes place
Possible values are Africa (excludes MENA), Americas, Asia and Pacific, Europe and Eurasia, Middle East and North Africa, Cross-regional, Other


AgtId: Agreement ID
Unique identifier for agreement document


Agt: Agreement Name
Name as appears in the agreement document
Popular names may be included in parentheses


Dat: Date Signed
Date agreement signed/agreed to
In cases of date periods/ranges in databases, last date considered Dat
Format is YYYY-MM-DD


Agtp: Agreement type
Character variable for nature of agreement & conflict, 3 possibilities are...

(1) Inter – interstate treaty & conflict (international – example: Iraq/Kuwait, North/South Korea)

(2) InterIntra – interstate agreement about intrastate conflict(s) in existing (de-facto or legal) borders, parties include  states or international actors

(3) Intra – intrastate agreement about intrastate conflict, conflict mainly within single state’s borders, may be +1 state party, not pure interstate agreements & have international parties

Stage: Agreement stage
Character variable for peace process stage during which agreement signed, 8 possibilities are...
	
(1) Pre: pre-negotiation – about getting parties to negotiation, “talking about how they are going to talk”

(2) SubPar: framework-substantive, partial – concern parties discussing & agreeing to substantive issues to resolve conflict without addressing all of them (implies future agreements will be needed)

(3) SubComp: framework-substantive, comprehensive – concern parties discussing & agreeing to substantive issues to completely resolve conflict
	
(4) FrCons: constitution – document that operates as a comprehensive interim or final constitution in name or function

(5) Imp: Implementation/renegotiation – aims to implement an earlier agreement, excludes ceasefires

(6) Ren: Renewal – ~1 page agreements to renew past commitments, excludes ceasefire renewals

(7) Cea: Ceasefire/related – agreements entirely providing for a ceasefire or association demobilization, or purely providing for a monitoring arrangement for or extension of a ceasefire

(8) Other – all agreements that don’t fit previously listed categories

HrGen: Human Rights/Rule of Law
General references or rhetorical commitments to human rights, principles of humanitarianism/law, international law, ‘rule of law’
0 indicates unaddressed; 1 indicates addressed


Eps: Economic Power sharing
Joint participation in economic institutions or territorial fiscal federalism
1 indicates mention without details, 2 indicates some details on modalities or implementation, 3 indicates many details on modalities or implementation, 0 indicates not addressed


Mps: Military Power sharing
Share power with police, army, security ministries
1 indicates mention without details; 2 indicates some details on modalities or implementation, 3 indicates many details on modalities or implementation, 0 indicates not addressed


Pol: Political Institutions (new or reformed)
Any mention of mechanisms reforming or establishing new political institutions (for example: legislature, executive), including interim administration or new democratic institutions
0 indicates unaddressed; 1, 2, 3 indicates addressed (increasing specificity as value increases)


Polps: Political Power sharing 
Establish executive grand coalition, proportional legislative representation, mutual veto/weighted majorities in areas of group ‘vital interest,’ segmental autonomy (e.g. “sport,” “education”), involvement of international actors
1 indicates mention without details, 2 indicates details without indication of how/when will be implemented, 3 indicates details about institutional arrangements, 0 indicates not addressed


Terps: Territorial Power sharing
Divide power by territories
1 indicates mention without details; 2 indicates some details on implementation; 3 indicates many details on power sharing, modalities & timelines; 0 indicates not addressed


GeWom: Women, girls and gender
Binary variable – 1 indicates topic addressed, 0 not addressed
Women, girls and gender topics are women, women’s inclusion, women’s rights; references to girls, widows, mothers, sexual violence, gender violence, UNSCR 1325 (UN resolution affirming importance of women in peacekeeping), CEDAW (Convention on the Elimination of All Forms of Discrimination Against Women - UN adopted 1979), lactating women


TjMech: Transitional Justice Past Mechanism
Calls or provides for a body other than one specifically tailored to other categories of some sort to ‘deal with the past’ (for example, regional conservatories, Truth and Reconciliation Commissions)
0 indicates unaddressed; 1, 2, 3, indicates addressed (increasing specificity as value increases)
