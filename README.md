# pax
Visualizing Peace

A Data Visualization Project for the Political Settlements Research Programme (http://www.politicalsettlements.org/)
By Lucy Havens (Centre for Design Informatics, University of Edinburgh) and Mengting Bao (School of Informatics, University of Edinburgh)

Data Source: Peace Agreements Database (PA-X) - www.peaceagreements.org/search
Documentation: https://paxviz.wordpress.com/


<b>PA-X CODEBOOK EXCERPTS (as relevant to this data visualization project)</b>

<em>For complete Codebook visit www.peaceagreements.org</em>


<b>Con: Country/Entity</b>
Where the conflict originated, has territorial element, or relates to

<em>Appears in "Agreement Details" of visualization's left sidebar for "Agreements in Time and Space" and "Agreements Comparison"</em>


<b>AgtId: Agreement ID</b>
Unique identifier for agreement document, a number

<em>Used to determine which agreement details to display based on where a user hovers or clicks a visualization</em>


<b>Agt: Agreement Name</b>
Name as appears in the agreement document, popular names may be included in parentheses

<em>Appears in "Agreement Details" of visualization's left sidebar for "Agreements in Time and Space" and "Agreements Comparison"</em>


<b>Dat: Date Signed</b>
Date agreement signed/agreed to

In cases of date periods/ranges in databases, last date considered Dat, format is YYYY-MM-DD

<em>Appears in "Agreement Details" of visualization's left sidebar for "Agreements in Time and Space" and "Agreements Comparison"</em>


<b>Agtp: Agreement type</b>
Character variable for nature of agreement & conflict, 3 possibilities are...

(1) <b>Inter</b> – interstate treaty & conflict (international – example: Iraq/Kuwait, North/South Korea)

(2) <b>InterIntra</b> – interstate agreement about intrastate conflict(s) in existing (de-facto or legal) borders, parties include  states or international actors

(3) <b>Intra</b> – intrastate agreement about intrastate conflict, conflict mainly within single state’s borders, may be +1 state party, not pure interstate agreements & have international parties

<em>Appears in "Agreement Details" of visualization's left sidebar for "Agreements in Time and Space" and "Agreements Comparison"</em>


<b>Stage: Agreement stage</b>
Character variable for peace process stage during which agreement signed, 8 possibilities are...	

(1) <b>Pre: pre-negotiation</b> – about getting parties to negotiation, “talking about how they are going to talk”

(2) <b>SubPar: framework-substantive, partial</b> – concern parties discussing & agreeing to substantive issues to resolve conflict without addressing all of them (implies future agreements will be needed)

(3) <b>SubComp: framework-substantive, comprehensive</b> – concern parties discussing & agreeing to substantive issues to completely resolve conflict

(4) <b>FrCons: constitution</b> – document that operates as a comprehensive interim or final constitution in name or function

(5) <b>Imp: Implementation/renegotiation</b> – aims to implement an earlier agreement, excludes ceasefires

(6) <b>Ren: Renewal</b> – ~1 page agreements to renew past commitments, excludes ceasefire renewals

(7) <b>Cea: Ceasefire/related</b> – agreements entirely providing for a ceasefire or association demobilization, or purely providing for a monitoring arrangement for or extension of a ceasefire

(8) <b>Other</b> – all agreements that don’t fit previously listed categories

<em>Colors of agreements in "Agreements Comparison" timelines are based on the agreements' stages</em>


<b>HrGen: Human Rights/Rule of Law</b>
General references or rhetorical commitments to human rights, principles of humanitarianism/law, international law, ‘rule of law’

0 indicates unaddressed; 1 indicates addressed

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>Eps: Economic Power sharing</b>
Joint participation in economic institutions or territorial fiscal federalism

0 indicates not addressed, 1 indicates mention without details, 2 indicates some details on modalities or implementation, 3 indicates many details on modalities or implementation

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>Mps: Military Power sharing</b>
Share power with police, army, security ministries

1 indicates mention without details; 2 indicates some details on modalities or implementation, 3 indicates many details on modalities or implementation, 0 indicates not addressed

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>Pol: Political Institutions (new or reformed)</b>
Any mention of mechanisms reforming or establishing new political institutions (for example: legislature, executive), including interim administration or new democratic institutions

0 indicates unaddressed; 1, 2, 3 indicates addressed (increasing specificity as value increases)

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>Polps: Political Power sharing</b>
Establish executive grand coalition, proportional legislative representation, mutual veto/weighted majorities in areas of group ‘vital interest,’ segmental autonomy (e.g. “sport,” “education”), involvement of international actors

1 indicates mention without details, 2 indicates details without indication of how/when will be implemented, 3 indicates details about institutional arrangements, 0 indicates not addressed

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>Terps: Territorial Power sharing</b>
Divide power by territories

1 indicates mention without details; 2 indicates some details on implementation; 3 indicates many details on power sharing, modalities & timelines; 0 indicates not addressed

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>TjMech: Transitional Justice Past Mechanism</b>
Calls or provides for a body other than one specifically tailored to other categories of some sort to ‘deal with the past’ (for example, regional conservatories, Truth and Reconciliation Commissions)

0 indicates unaddressed; 1, 2, 3, indicates addressed (increasing specificity as value increases)

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>


<b>GeWom: Women, girls and gender</b>
Women, girls and gender topics are women, women’s inclusion, women’s rights; references to girls, widows, mothers, sexual violence, gender violence, UNSCR 1325 (UN resolution affirming importance of women in peacekeeping), CEDAW (Convention on the Elimination of All Forms of Discrimination Against Women - UN adopted 1979), lactating women

Binary variable – 1 indicates topic addressed, 0 not addressed

<em>Appears in visualization's left sidebar as a filter and petal in agreements' symbols (flowers) for "Agreements in Time and Space", and as a filter in the "Select Codes" dropdown for "Agreements Comparison"</em>
