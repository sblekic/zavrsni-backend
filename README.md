# Završni rad - Razvoj pametnih ugovora i poslužiteljskog sloja Web3 aplikacije za upravljanje ulaznicama

Završni rad se sastoji od backend dijela koji se nalazi u ovom repozitoriju i frontend dijela, koji se može pregledati [ovdje](https://github.com/sblekic/zavrsni-frontend).

Namjera ovog rada je istraživati moguću implementaciju web3 tehnologije, specifično koncept ERC-721 standarda za nezamjenjive žetone (non-fungible token), u kontekstu prodaje ulaznica.

Za navedenu svrhu, razvijena je web3 aplikacija "_showStarter_", koja koristi Polygon-Ethereum platformu radi provedbu prodaje ulaznica u ime organizatora koncerata.

Web3 dio aplikacije se sastoji od pametnih ugovora po imenu "EventFactory" i "EventImplementation" koji upravljaju logikom prodaje ulaznica.
Primarna funkcija pametnih ugovora je organizatoru omogućiti upravljanje sekundarnog tržišta odnosno preprodaji ulaznica, te kupcu pružiti sigurni kanal kupnje i prodaje ulaznica na istim.
