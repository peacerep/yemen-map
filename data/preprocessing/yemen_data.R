library(tidyverse)

local <- read_csv('yemen_local.csv')

# rename columns to match pax download
names(local) <- c("AgtId", "Agt", "LocalLat", "LocalLon", "Comment")

# Add column to mark them as local agreements
local$Local <- TRUE

# Read file downloaded from peaceagreements.org
pax <- read_csv('yemen_pax_download.csv')

# get only the columns we need
pax_sel <- pax %>% transmute(
        PP,
        PPName,
        AgtId,
        Agt,
        Agtp,
        Con,
        Dat,
        Eps,
        GeWom, 
        HrFra,
        Mps,
        Pol,
        Polps,
        Stage, 
        StageSub,
        Status, 
        Terps,
        TjMech,
        Year = format(pax$Dat, "%Y"))

# merge them based on shared columns
merged <- merge(pax_sel, local, all=T)

# fill Local column
merged$Local[is.na(merged$Local)] <- FALSE

# check if any got duplicated (due to mismatched titles)
sum(duplicated(merged$AgtId))

# save merged file
write_csv(merged, 'yemen_merge.csv', na='')
