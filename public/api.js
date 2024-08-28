fetch('https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/champion.json')
.then(response => response.json())
.then(data => {
    const champions = data.data;
    const select = document.getElementById('championSelect');

   
    for (const key in champions) {
        const champion = champions[key];
        const option = document.createElement('option');
        option.value = champion.id;
        option.text = champion.name;
        select.appendChild(option);
    }

   
    select.addEventListener('change', function() {
        const selectedChampion = champions[this.value];
        const display = document.getElementById('championDisplay');

        if (selectedChampion) {
            const imageUrl = `https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${selectedChampion.image.full}`;
            document.getElementById('championImage').src = imageUrl;
            document.getElementById('championName').textContent = selectedChampion.name;
            display.style.display = 'flex';
        } else {
            display.style.display = 'none';
        }
    });
})
.catch(error => console.error('Error fetching champion data:', error));