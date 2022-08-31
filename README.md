<center>

![logo](logo.png)

<h1>Sliding logs</h1>

</center>

### RATE LIMITER

Viene fissato il tempo di apertura della finestra.
Bisogna tener traccia del timestamp di ogni richiesta che fa l'utente, richieste ordinate in base al tempo.

Prendi tutte le richieste nell'ultima finestra 60s e controlla se il numero di richieste supera il limite
Se il numero di richieste è inferiore al limite, registra la richiesta e processala

Se il numero è uguale al limite, droppa la richiesta

| PRO                                                                                                           | CONS                                                                                      |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| metodo più accurato perchè tiene conto della finestra temporale per utente e non una finestra fissa per tutti | non è efficiente a livello di memoria perchè memorizziamo una nuova voce per ogni request |
| tiene conto dell'attività dell'utente                                                                         | costoso da calcolare,per ogni nuova req bisognerà recuperare le request negli ultimi 60s e calcolare il numero di request già effettuate                                      
||non è influenzato da un aumento di chiamate verso la fine della finestra visto che non è fissa|
