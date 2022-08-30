<center>

![logo](logo.png)

<h1>Fixed window counter</h1>

</center>

### RATE LIMITER 

Viene fissato il numero di chiamate che l'utente fa in una finestra temporale.

Window: finestra temporale nel quale vengono fatte le chiamate

per ogni utente:

10 chiamate al minuto === 60s window

salvare l'id dell'utente e tenere il conto delle chiamate se diventano maggiori del numero di chiamate massimo allora le successive
chiamate andranno in errore.
Allo scadere della window verranno resettati i valori a zero.

| PRO 	                    | CONS                          	    |
|---------------------------|---------------------------------------|
| facile da implementare 	| Ingiusto imporre una finestra temporale per tutti gli utenti |    
|                           | Non è affidabile, il server potrebbe processare anche 20 request per 10s per utente se ad esempio l'utente fa le chiamate tra 5s finali della finestra e i 5s iniziali della successiva|
|                           | Nelle finestre con limite temporale alto l'utente potrebbe effettuare il massimo delle chiamate nei primi minuti ed essere costretto ad aspettare parecchio tempo prima che si apra la finestra successiva|
