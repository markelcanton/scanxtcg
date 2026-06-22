document.getElementById('fetchBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('cardInput').value.trim();
    const resultDiv = document.getElementById('card-result');

    if (!userInput) return alert("Antes de buscar, debes introducir el nombre de una carta.");

    resultDiv.innerHTML = "<p>Buscando resultados... Por favor, espera.</p>";

    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${userInput}"&orderBy=-set.releaseDate`); 
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            let totalHTML = "";

            data.data.forEach(card => {
                const pm = card.cardmarket?.prices;
                const tcgp = card.tcgplayer?.prices?.holofoil || card.tcgplayer?.prices?.normal;
                const rawPrice = pm?.trendPrice || pm?.avg30 || pm?.lowPrice;
                
                let price = "";
                if (rawPrice) {
                    price = `${rawPrice.toFixed(2)} €`;
                } else if (tcgp?.market) {
                    price = `~ ${(tcgp.market * 0.9).toFixed(2)} €`;
                } else {
                    price = `<span style="font-size: 0.85rem; color: #777; font-weight: normal;">Ver mercado en vivo</span>`;
                }

                const codigoVisual = `${card.number}/${card.set.printedTotal}`;

                const query = `${card.name} ${card.number}`;
                const cardmarketUrl = `https://www.cardmarket.com/es/Pokemon/Products/Search?searchString=${encodeURIComponent(query)}`;

                totalHTML += `
                            <div class="card-info anim-entrada" style="background: white; padding: 15px; border-radius: 12px; border: 1px solid #ddd; width: 220px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                                <div>
                                    <img src="${card.images.small}" alt="${card.name}" loading="lazy" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
                                    <h4 style="margin: 5px 0; font-size: 0.9rem; color: #333;">${card.name}</h4>
                                    <p style="color: #777; font-size: 0.75rem; margin-bottom: 10px;">
                                        ${card.set.name}<br>
                                        <strong>${codigoVisual}</strong>
                                    </p>
                                </div>
                                <div>
                                    <div style="background: #f1f8ff; padding: 8px; border-radius: 6px; border: 1px solid #1ba8bb; margin-bottom: 10px;">
                                        <span style="font-size: 0.7rem; color: #1c7ea5; font-weight: bold;">TENDENCIA DE PRECIO</span>
                                        <div style="font-size: 1.1rem; font-weight: bold; color: #333;">${price}</div>
                                    </div>
                                    <a href="${cardmarketUrl}" target="_blank" style="font-size: 0.8rem; color: #1c7ea5; text-decoration: none; font-weight: bold;">
                                        Ver en Cardmarket
                                    </a>
                                </div>
                            </div>`;
            });

            resultDiv.innerHTML = totalHTML;

        } else {
            resultDiv.innerHTML = `<div class="error-vibrar">No se encontraron cartas.</div>`;
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        resultDiv.innerHTML = "<p>Error de conexión con la base de datos.</p>";
    }
});
