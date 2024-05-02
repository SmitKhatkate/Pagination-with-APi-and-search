document.addEventListener("DOMContentLoaded", function() {
    let data = [];
    let limit = 5;
    let currentPage = 1;
    let totalPage = 1;

    const searchBox = document.getElementById('searchBox');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    searchBox.addEventListener("keydown", handleKeyPress);
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);

    function handleKeyPress(event) {
        if (event.key !== 'Enter') return;

        const searchValue = event.target.value.trim();
        if (!searchValue) {
            displayMessage('Start Searching');
            return;
        }

        currentPage = 1;
        displayMessage('', true);
        fetchData(searchValue, currentPage, updateCityCount());

    }

    function prevPage() {
        if (currentPage <= 1) return;

        currentPage--;
        fetchData(searchBox.value, currentPage, limit);
    }

    function nextPage() {
        if (currentPage >= totalPage) return;

        currentPage++;
        fetchData(searchBox.value, currentPage, limit);
    }

    function updateCityCount() {
        limit = parseInt(document.getElementById('city-count').value, 10);
        return limit;
    }

    document.getElementById("nextPage").addEventListener("click", nextPage);
    document.getElementById("prevPage").addEventListener("click", prevPage);

    function updateCityCount() {
        limit = parseInt(document.getElementById('city-count').value, 10) || 0;
        return limit;
    }

    function fetchData(searchValue, currentPage, limit) {
        var options = {
            method: 'GET',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions',
            params: {namePrefix: searchValue, offset: (currentPage - 1) * limit, limit: limit},
            headers: {
                'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                'x-rapidapi-key': '96a18ad53amsh441cb924051a530p1f0d6djsndf184295b94f'
            }
        };

    axios.request(options).then(function(response) {
        data = response.data.data;
        totalPage = Math.ceil(Number(response.data.metadata.total_count) / Number(limit));
        if(data.length > 0) {
            displayData();
            updatePageInfo();
        } else {
            displayMessage('No results found');
            document.querySelector('.pagination').style.display = 'none';
        }
    }).catch(function(error) {
        console.error(error);
        displayMessage('Error fetching data');
    });
}


function displayData() {
    var tableBody = document.getElementById('tableBody'); 
    tableBody.innerHTML = ""; 

    data.forEach(function(item, index) {
        var row = document.createElement('tr');
        row.innerHTML = `<td>${((currentPage - 1) * limit) + (index + 1)}</td>
                         <td>${item.name}</td>
                         <td><img src="https://flagsapi.com/${item.countryCode}/flat/64.png" style="width: 32px; height: 32px;" alt="Flag of ${item.name}">${item.countryCode}</td>`;
        tableBody.appendChild(row);
    });

    document.getElementById('spinner').style.display = 'none'; 
}

function displayMessage(message, isLoading = false) {
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = `<tr><td colspan='3'>${message}</td></tr>`;
    document.getElementById('spinner').style.display = isLoading ? 'block' : 'none';
}
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault(); 
        document.getElementById('searchBox').focus();
    }
});
function updatePageInfo() {
    document.getElementById('page-info').innerHTML = `  Page ${currentPage} `;
}
});
