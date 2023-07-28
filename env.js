// namjestio sam konfiguraciju environmenta na top level tako da bude dostupan u svim datotekama,
// odnosno da izbjegavam import u svaku datoteku gdje moram koristiti env var
// importiram ovo u entry point aplikacije index i izgleda da radi svugdje
import dotenv from "dotenv";

export default dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
