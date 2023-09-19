# Završni rad - Razvoj pametnih ugovora i poslužiteljskog sloja Web3 aplikacije za upravljanje ulaznicama

## Opće informacije o radu

Autor: Sandi Blekić<br>
Mentor: doc. dr. sc. Nikola Tanković<br>
Sveučilište Jurja Dobrile u Puli, Fakultet informatike

Završni rad se sastoji od backend dijela koji se nalazi u ovom repozitoriju i frontend dijela, koji se može pregledati [ovdje](https://github.com/sblekic/zavrsni-frontend). <br>Aplikacija je javno dostupna na adresi: https://showstarter.netlify.app/

## Sažetak

Web aplikacija "showStarter" je decentralizirana aplikacija koja se u namjeni može usporediti sa web-aplikacijama za preprodaju ulaznica poput „Eventim.hr“ i „Entrio.hr“, u smislu da korisniku nudi platformu za jednostavnu kupovinu ulaznica za koncerte unutar hrvatske.

Primarni problem koji se želi riješiti putem aplikacije je praksa scalpinga, odnosno preprodaja karata rasprodanih događaja po znatno višim cijenama.
Scalping je praksa koja uvelike utežava i često u potpunosti uskraćuje kupovinu ulaznica po nominalnoj cijeni, što rezultira velikim nezadovoljstvom obožavatelja i propuštenim izvorom prihoda za organizatore događaja. Osim toga, i u slučaju kada se kupac odluči za kupnju ulaznica iz oglasnika taj proces je u najmanjoj mjeri nepouzdan, te kupac ne može biti u potpunosti siguran da kupljena ulaznica nije krivotvorena.

Cilj ove aplikacije je obožavateljima pružati sigurnu plaformu za kupnju i preprodaju ulaznica a organizatorima događaja omogućiti kontrolu nad sekundarnim tržištem

## Postavljanje projekta na lokalnom račualu

### Potreban softver

- [NodeJs](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) ili koristiti cloud verziju

### Podešavanje varijabli okruženja

U ".env.development.example" potrebno je promijeniti tekst koji se nalazi u vitičastim zagradama te preimenovati datoteku u ".env.development".

### Instalacija npm paketa

```
npm install
```

### Pokretanje lokalnog blockchaina

```
npm run ganache
```

### Deploy pametnih ugovora

**Uvjet:** kopija [frontenda](https://github.com/sblekic/zavrsni-frontend) ovog projekta je preuzeta na računalu.

Između ostalog, pokretanjem ove skripte se ABI pametnih ugovora sprema na frontendu.

```
npx hardhat run scripts/deploy.js
```

### Punjenje baze podataka

```
npm run populateDb
```

### Pokretanje poslužitelja

```
npm run dev
```
