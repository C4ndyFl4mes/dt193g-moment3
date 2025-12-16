# Moment 3

## Beskrivning
Webbplatsen för repot är skriven med hjälp av Vue som frontend ramverk. Det är en single page application där navigering sker med Vue:s egna router.

## Komponenter
Det finns en del komponenter som skapades för webbplatsen. De viktigaste är BaseNav, BaseTable och BaseTableRow där det mesta av arbetet skedde.

BaseTable gör förfrågningar till API:et och skapar, uppdaterar eller raderar dotterelement efter behov.

BaseTableRow skickar en "förfrågan" till moderelementet om att få bli uppdaterad eller raderad och skickar relevant data.

BaseNav hanterar den responsiva huvudmenyn.