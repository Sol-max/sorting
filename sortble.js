// Constants
const DATA_URL = 'https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json';
const PAGE_SIZES = [10, 20, 50, 100, Infinity];

// Variables
let data = [];
let pageSize = 20;
let currentPage = 1;
let sortColumn = 'name';
let sortDirection = 'asc';
const searchInput = document.getElementById('search-input');
const pageSizeSelect = document.getElementById('page-size');
const pageSelect = document.getElementById('page-select');
const tableBody = document.getElementsByTagName('tbody')[0];
const nameHeader = document.getElementById('name-header');

nameHeader.addEventListener('click', () => {
  if (sortColumn === 'name') {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = 'name';
    sortDirection = 'asc';
  }

  renderTable(data, currentPage, pageSize, sortColumn, sortDirection);
});

// Functions
const superheroTable = document.getElementById("superhero-table");
const superheroTableBody = superheroTable.getElementsByTagName("tbody")[0];
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(superhero => {
      const row = superheroTableBody.insertRow(-1);
      const nameCell = row.insertCell(0);
      const intelligenceCell = row.insertCell(1);
      const strengthCell = row.insertCell(2);
      const speedCell = row.insertCell(3);
      const durabilityCell = row.insertCell(4);
      const powerCell = row.insertCell(5);
      const combatCell = row.insertCell(6);
      
      nameCell.innerHTML = superhero.name;
      intelligenceCell.innerHTML = superhero.powerstats.intelligence;
      strengthCell.innerHTML = superhero.powerstats.strength;
      speedCell.innerHTML = superhero.powerstats.speed;
      durabilityCell.innerHTML = superhero.powerstats.durability;
      powerCell.innerHTML = superhero.powerstats.power;
      combatCell.innerHTML = superhero.powerstats.combat;
    });
    data = data.map(hero => ({
      ...hero,
      icon: hero.images.sm,
    }));
    renderTable(data, currentPage, pageSize, sortColumn, sortDirection);
  });

pageSizeSelect.addEventListener('change', (event) => {
  pageSize = parseInt(event.target.value);
  renderTable(data, currentPage, pageSize, sortColumn, sortDirection);
});

const handleSearch = () => {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const filteredData = data.filter(hero => {
    const nameMatch = hero.name.toLowerCase().includes(searchQuery);
    const fullNameMatch = hero.biography.fullName.toLowerCase().includes(searchQuery);
    return nameMatch || fullNameMatch;
  });
  renderTable(filteredData, currentPage, pageSize, sortColumn, sortDirection);
};

// Sorts the provided data array by the column with the given columnIndex 
// in the given sortOrder ('asc' or 'desc')
const sortData = (data, columnIndex, sortOrder) => {
  const sortedData = [...data].sort((a, b) => {
    const valueA = getColumnValue(a, columnIndex);
    const valueB = getColumnValue(b, columnIndex);

    if (valueA === valueB) {
      return 0;
    }

    let comparison = 0;
    if (sortOrder === 'asc') {
      comparison = valueA < valueB ? -1 : 1;
    } else {
      comparison = valueA > valueB ? -1 : 1;
    }

    return comparison;
  });

  return sortedData;
};


// Renders the table using the provided data, currentPage, and pageSize values
const renderTable = (data, currentPage, pageSize, sortColumn, sortDirection) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  const filteredData = filterData(data);
  const sortedData = sortData(filteredData, sortColumn, sortDirection);

  tableBody.innerHTML = sortedData
    .slice(startIndex, endIndex)
    .map(hero => `
      <tr>
        <td><img src="${hero.icon}" alt="${hero.name}" width="40"></td>
        <td>${hero.name}</td>
        <td>${hero.fullName}</td>
        <td>${hero.powerstats.intelligence}</td>
        <td>${hero.powerstats.strength}</td>
        <td>${hero.powerstats.speed}</td>
        <td>${hero.powerstats.durability}</td>
        <td>${hero.powerstats.power}</td>
        <td>${hero.powerstats.combat}</td>
        <td>${hero.race}</td>
        <td>${hero.gender}</td>
        <td>${hero.height}</td>
        <td>${hero.weight}</td>
        <td>${hero.placeOfBirth}</td>
        <td>${hero.alignment}</td>
      </tr>
    `)
    .join('');

  const totalPages = Math.ceil(filteredData.length / pageSize);
  pageSelect.innerHTML = PAGE_SIZES
    .filter(size => size <= filteredData.length)
    .map(size => `
      <option value="${size}" ${pageSize === size ? 'selected' : ''}>${size}</option>
    `)
    .join('');
};

/*
This function first gets the user's search query from the search input element 
and converts it to lowercase. 
It then filters the data array using the filter method and a callback function 
that checks if either the hero's name or full name contains the search query.

The displayData array is updated with the filtered results, 
and the renderTable function is called again with the updated displayData,
currentPage, and pageSize values to re-render the table with the filtered data.
*/
const filterData = (data, searchQuery) => {
  const filteredData = data.filter(hero => {
    const nameMatch = hero.name.toLowerCase().includes(searchQuery);
    const fullNameMatch = hero.fullName.toLowerCase().includes(searchQuery);
    return nameMatch || fullNameMatch;
  });

  return filteredData;
};


/*
This function takes in a rowData object and an index for the desired column (columnIndex).
It first retrieves all the keys of the rowData object and uses the columnIndex 
to get the specific key for the desired column. 
Finally, it returns the value of that key in the rowData object.
*/
const getColumnValue = (rowData, columnIndex) => {
  const keys = Object.keys(rowData);
  const key = keys[columnIndex];
  return rowData[key];
};
function updatePageSizes() {
  let select = document.getElementById("page-size-select");
  let selectedValue = select.value;
  pageSize = parseInt(selectedValue);
  currentPage = 1; // reset current page to 1 when page size is changed
  updateTable();
}
