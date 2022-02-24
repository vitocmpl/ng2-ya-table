import { LanguagesMap } from "./ng2-ya-table-interfaces";

export const Languages: LanguagesMap = {
    en: {
        search: "Search...",
        info: "Showing {{start}} to {{end}} of {{total}} entries",
        pagination: {
            first: "First",
            previous: "Previous",
            next: "Next",
            last: "Last"
        }
      },
    it: {
        search: "Cerca...",
        info: "Visualizzati da {{start}} a {{end}} di {{total}} elementi",
        pagination: {
            first: "Inizio",
            previous: "Precedente",
            next: "Successivo",
            last: "Fine"
        }
    },
    es: {
        search: "Buscar...",
        info: "Mostrando filas {{start}} al {{end}} de {{total}} resultados",
        pagination: {
            first: "Primera",
            previous: "Anterior",
            next: "Siguiente",
            last: "Última"
        }
    }
}