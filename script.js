document.addEventListener("DOMContentLoaded", function() {
    var data = [];
    var limit = 5;
    var currentPage = 1;
    var totalPage = 1;
    var prevButton = document.getElementById('prevPage');
    var nextButton = document.getElementById('nextPage');

    document.getElementById("searchBox").addEventListener("keydown", handleKeyPress);

document.addEventListener("DOMContentLoaded", function() {
    prevButton = document.getElementById('prevPage');
    nextButton = document.getElementById('nextPage');
    // rest of your script here...
});
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
        params: {namePrefix: searchValue, offset: (currentPage - 1) * limit, limit: limit},
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
                         <td><img src="https://flagsapi.com/${item.countryCode}/flat/64.png" style="width: 32px; height: 32px;">${item.countryCode}</td>`;
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



function nextPage() {
    if (currentPage < totalPage) {
        currentPage++;
        prevButton.disabled = false;
        if(currentPage===totalPage){nextButton.disabled = true;}
        fetchData(document.getElementById('searchBox').value, currentPage, limit);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        nextButton.disabled = false;
        if(currentPage===1){prevButton.disabled = true;}
        fetchData(document.getElementById('searchBox').value, currentPage, limit);
    }
}


function updatePageInfo() {
    document.getElementById('page-info').innerHTML = `Page ${currentPage} of ${totalPage}`;
}
});
