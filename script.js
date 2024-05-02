var data = [];
var limit = 5;
var currentPage = 1;
var totalPage = 1;

document.getElementById("searchBox").addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        var searchValue = event.target.value;
        if (!searchValue || searchValue.trim() === '') {
            displayMessage('Start Searching');
            return;
        }

        currentPage = 1; 

        displayMessage('', true); 
        fetchData(searchValue, 1, updateCityCount());
    }
}

function updateCityCount() {
    limit = document.getElementById('city-count').value; 
    return limit;
}

function fetchData(searchValue, currentPage, limit) {
    var options = {
        method: 'GET',
        url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions',
        params: {countryIds: 'IN', namePrefix: searchValue, offset: (currentPage - 1) * limit, limit: limit},
        headers: {
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
            'x-rapidapi-key': '96a18ad53amsh441cb924051a530p1f0d6djsndf184295b94f' 
        }
    };

    axios.request(options).then(function (response) {
        data = response.data.data;
        totalPage = Math.ceil(response.data.metadata.total_count / limit);
        if (data.length > 0) {
            displayData();
            updatePageInfo(); 
        } else {
            displayMessage('No results found');
            document.querySelector('.pagination').style.display = 'none'; 
        }
    }).catch(function (error) {
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
                         <td><img src="https://www.countryflags.io/${item.countryCode}/flat/32.png">${item.countryCode}</td>`;
        tableBody.appendChild(row);
    });

    document.getElementById('spinner').style.display = 'none'; // Hide spinner
}

function displayMessage(message, isLoading = false) {
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = `<tr><td colspan='3'>${message}</td></tr>`;
    document.getElementById('spinner').style.display = isLoading ? 'block' : 'none';
}

function nextPage() {
    if (currentPage < totalPage) {
        currentPage++;
        fetchData(document.getElementById('searchBox').value, currentPage, limit);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchData(document.getElementById('searchBox').value, currentPage, limit);
    }
}

function updatePageInfo() {
    document.getElementById('page-info').innerHTML = `Page ${currentPage} of ${totalPage}`;
}