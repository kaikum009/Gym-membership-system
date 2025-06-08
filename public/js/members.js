// document.addEventListener('DOMContentLoaded', function () {
//     const tableBody = document.getElementById('tableBody');
//     const searchInput = document.getElementById('searchInput');
//     const startItem = document.getElementById('startItem');
//     const endItem = document.getElementById('endItem');
//     const totalItems = document.getElementById('totalItems');
//     const pageNumbers = document.getElementById('pageNumbers');
//     const prevPage = document.getElementById('prevPage');
//     const nextPage = document.getElementById('nextPage');
//     const firstPage = document.getElementById('firstPage');
//     const lastPage = document.getElementById('lastPage');
//     const addRowBtn = document.getElementById('addRowBtn');
//     const saveBtn = document.getElementById('saveBtn');
//     const loadingIndicator = document.getElementById('loadingIndicator');  // Optional: For showing a loading spinner during data fetch

//     let currentPage = 1;
//     const itemsPerPage = 10;
//     let totalPages = 1;
//     let allMembers = [];
//     let editedMembers = [];

//     // Toggle loading spinner visibility
//     function toggleLoading(isLoading) {
//         if (loadingIndicator) {
//             loadingIndicator.style.display = isLoading ? 'block' : 'none';
//         }
//     }
//     // Fetch members from backend
//     async function fetchMembers(search = '', page = 1) {
//         toggleLoading(true);
//         alert('start')
//         try {
//             const response = await fetch(`http://localhost:4000/api/members?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(search)}`);
//             const data = await response.json();

//             alert('fetching complete: ', response)

//             allMembers = data.data;
//             totalPages = data.totalPages;

//             renderTable();
//             updatePaginationInfo(data);
//             updatePaginationControls();
//             alert('rendering UI with new data')
//         } catch (error) {
//             console.error('Error fetching members:', error);
//         } finally {
//             toggleLoading(false);
//         }
//     }

//     // Render table with data
//     function renderTable() {
//         tableBody.innerHTML = '';
//         allMembers.forEach(member => {
//             const row = document.createElement('tr');
//             row.dataset.id = member.id_no;
//             row.innerHTML = `
//                 <td>${member.id_no}</td>
//                 <td contenteditable="true" data-field="name">${member.name}</td>
//                 <td contenteditable="true" data-field="email">${member.email}</td>
//                 <td contenteditable="true" data-field="phone">${member.phone}</td>
//                 <td contenteditable="true" data-field="start_date">${member.start_date}</td>
//                 <td contenteditable="true" data-field="end_date">${member.end_date}</td>
//                 <td>
//                     <button class="action-btn delete-btn">Delete</button>
//                 </td>
//             `;

//             // Add event listeners for editing cells
//             row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
//                 cell.addEventListener('focus', () => {
//                     const id = row.dataset.id;
//                     const originalValue = cell.textContent;
//                     cell.addEventListener('blur', function onBlur() {
//                         const newValue = cell.textContent;
//                         if (newValue !== originalValue) {
//                             trackEdit(id, cell.dataset.field, newValue);
//                         }
//                         cell.removeEventListener('blur', onBlur);
//                     }, { once: true });
//                 });
//             });

//             // Add delete button event
//             row.querySelector('.delete-btn').addEventListener('click', () => deleteMember(member.id_no));

//             tableBody.appendChild(row);
//         });
//     }

//     // Track edits for saving
//     function trackEdit(id, field, value) {
//         const existingEdit = editedMembers.find(m => m.id_no === id);
//         if (existingEdit) {
//             existingEdit[field] = value;
//         } else {
//             editedMembers.push({ id_no: id, [field]: value });
//         }
//         saveBtn.disabled = false;
//     }

//     function trackEdit(id, field, value) {
//         const memberToUpdateIndex = allMembers.findIndex(m => m.id_no === id);
//         if (memberToUpdateIndex !== -1) {
//             allMembers[memberToUpdateIndex][field] = value; // Update allMembers directly
    
//             const existingEditIndex = editedMembers.findIndex(m => m.id_no === id);
//             if (existingEditIndex !== -1) {
//                 editedMembers[existingEditIndex] = { ...allMembers[memberToUpdateIndex] }; // Update existing edit with the full object
//             } else {
//                 editedMembers.push({ ...allMembers[memberToUpdateIndex] }); // Add the full updated object
//             }
//             saveBtn.disabled = false;
//         }
//     }

//     // Update pagination info (start, end, total)
//     function updatePaginationInfo(data) {
//         startItem.textContent = ((currentPage - 1) * itemsPerPage) + 1;
//         endItem.textContent = Math.min(currentPage * itemsPerPage, data.total);
//         totalItems.textContent = data.total;
//     }

//     // Update pagination controls (prev, next, page numbers)
//     function updatePaginationControls() {
//         pageNumbers.innerHTML = '';
//         addPageNumber(1);  // Always show the first page

//         const startPage = Math.max(2, currentPage - 2);
//         const endPage = Math.min(totalPages - 1, currentPage + 2);

//         if (startPage > 2) {
//             pageNumbers.innerHTML += '<span>...</span>';
//         }

//         for (let i = startPage; i <= endPage; i++) {
//             addPageNumber(i);
//         }

//         if (endPage < totalPages - 1) {
//             pageNumbers.innerHTML += '<span>...</span>';
//         }

//         if (totalPages > 1) {
//             addPageNumber(totalPages);  // Always show the last page
//         }

//         prevPage.disabled = currentPage === 1;
//         nextPage.disabled = currentPage === totalPages;
//         firstPage.disabled = currentPage === 1;
//         lastPage.disabled = currentPage === totalPages;
//     }

//     // Create and add a page number button
//     function addPageNumber(page) {
//         const pageElement = document.createElement('button');
//         pageElement.className = `page-number ${page === currentPage ? 'active' : ''}`;
//         pageElement.textContent = page;
//         pageElement.addEventListener('click', () => {
//             currentPage = page;
//             fetchMembers(searchInput.value, page);
//         });
//         pageNumbers.appendChild(pageElement);
//     }

//     // Add new member (row)
//     addRowBtn.addEventListener('click', () => {
//         const tempId = Math.floor(Math.random() * -1000);
//         const newRow = document.createElement('tr');
//         newRow.dataset.id = tempId;
//         newRow.innerHTML = `
//             <td>${tempId}</td>
//             <td contenteditable="true" data-field="name">New Member</td>
//             <td contenteditable="true" data-field="email">email@example.com</td>
//             <td contenteditable="true" data-field="phone">000-000-0000</td>
//             <td contenteditable="true" data-field="start_date">${new Date().toISOString().split('T')[0]}</td>
//             <td contenteditable="true" data-field="end_date">${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</td>
//             <td><button class="action-btn delete-btn">Delete</button></td>
//         `;
//         tableBody.prepend(newRow);
//         newRow.querySelector('[data-field="name"]').focus();
//         editedMembers.push({
//             id_no: tempId,
//             isNew: true,
//             name: 'New Member',
//             email: 'email@example.com',
//             phone: '000-000-0000',
//             start_date: new Date().toISOString().split('T')[0],
//             end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//         });
//         saveBtn.disabled = false;
//     });

//     // Save all changes (updates and new members)
//     saveBtn.addEventListener('click', async () => {
//         try {
//             const updates = editedMembers.filter(m => !m.isNew);
//             const creates = editedMembers.filter(m => m.isNew);

//             await Promise.all(updates.map(async (memberObj) => {
//                 const { id_no, ...rest } = member;
            
//                 await fetch(`/api/members/${id_no}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(rest)
//                 });
//             }));

//             await Promise.all(creates.map(async (member) => {
//                 const { isNew, ...newMember } = member;
//                 await fetch('/api/members', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(newMember)
//                 });
//             }));

//             // Refresh data and reset the state
//             editedMembers = [];
//             saveBtn.disabled = true;
//             fetchMembers(searchInput.value, currentPage);
//             alert('Changes saved successfully!');
//         } catch (error) {
//             console.error('Error saving changes:', error);
//             alert('Error saving changes. Please try again.');
//         }
//     });

    // Delete member
    // async function deleteMember(id) {
    //     if (confirm('Are you sure you want to delete this member?')) {
    //         try {
    //             await fetch(`/api/members/${id}`,  { method: 'DELETE' });
    //             fetchMembers(searchInput.value, currentPage);
    //         } catch (error) {
    //             console.error('Error deleting member:', error);
    //         }
    //     }
    // }

//     // Search functionality
//     searchInput.addEventListener('input', function () {
//         currentPage = 1;
//         fetchMembers(this.value, currentPage);
//     });

//     // Pagination button events
//     prevPage.addEventListener('click', () => {
//         if (currentPage > 1) {
//             currentPage--;
//             fetchMembers(searchInput.value, currentPage);
//         }
//     });

//     nextPage.addEventListener('click', () => {
//         if (currentPage < totalPages) {
//             currentPage++;
//             fetchMembers(searchInput.value, currentPage);
//         }
//     });

//     firstPage.addEventListener('click', () => {
//         currentPage = 1;
//         fetchMembers(searchInput.value, currentPage);
//     });

//     lastPage.addEventListener('click', () => {
//         currentPage = totalPages;
//         fetchMembers(searchInput.value, currentPage);
//     });

//     // Initial load
//     fetchMembers();
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const tableBody = document.getElementById('tableBody');
//     const searchInput = document.getElementById('searchInput');
//     const startItem = document.getElementById('startItem');
//     const endItem = document.getElementById('endItem');
//     const totalItems = document.getElementById('totalItems');
//     const pageNumbers = document.getElementById('pageNumbers');
//     const prevPage = document.getElementById('prevPage');
//     const nextPage = document.getElementById('nextPage');
//     const firstPage = document.getElementById('firstPage');
//     const lastPage = document.getElementById('lastPage');
//     const addRowBtn = document.getElementById('addRowBtn');
//     const saveBtn = document.getElementById('saveBtn');
//     const loadingIndicator = document.getElementById('loadingIndicator');

//     let currentPage = 1;
//     const itemsPerPage = 10;
//     let totalPages = 1;
//     let allMembers = [];
//     let editedMembers = [];

//     // Local Storage Key
//     const STORAGE_KEY = 'localMembers';

//     function toggleLoading(isLoading) {
//         if (loadingIndicator) {
//             loadingIndicator.style.display = isLoading ? 'block' : 'none';
//         }
//     }

//     function saveToLocalStorage(data) {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//     }

//     function loadFromLocalStorage() {
//         const data = localStorage.getItem(STORAGE_KEY);
//         return data ? JSON.parse(data) : [];
//     }

//     async function fetchMembers(search = '', page = 1) {
//         toggleLoading(true);
//         try {
//             allMembers = loadFromLocalStorage();
//             if (search) {
//                 allMembers = allMembers.filter(member =>
//                     member.name.toLowerCase().includes(search.toLowerCase())
//                 );
//             }

//             totalPages = Math.ceil(allMembers.length / itemsPerPage);
//             const start = (page - 1) * itemsPerPage;
//             const end = start + itemsPerPage;
//             renderTable(allMembers.slice(start, end));
//             updatePaginationInfo(allMembers.length);
//             updatePaginationControls();
//         } catch (error) {
//             console.error('Error loading members:', error);
//         } finally {
//             toggleLoading(false);
//         }
//     }

//     function renderTable(members) {
//         tableBody.innerHTML = '';
//         members.forEach(member => {
//             const row = document.createElement('tr');
//             row.dataset.id = member.id_no;
//             row.innerHTML = `
//                 <td>${member.id_no}</td>
//                 <td contenteditable="true" data-field="name">${member.name}</td>
//                 <td contenteditable="true" data-field="email">${member.email}</td>
//                 <td contenteditable="true" data-field="phone">${member.phone}</td>
//                 <td contenteditable="true" data-field="start_date">${member.start_date}</td>
//                 <td contenteditable="true" data-field="end_date">${member.end_date}</td>
//                 <td><button class="action-btn delete-btn">Delete</button></td>
//             `;

//             row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
//                 cell.addEventListener('focus', () => {
//                     const originalValue = cell.textContent;
//                     const id = parseInt(row.dataset.id);
//                     cell.addEventListener('blur', function onBlur() {
//                         const newValue = cell.textContent;
//                         if (newValue !== originalValue) {
//                             trackEdit(id, cell.dataset.field, newValue);
//                         }
//                         cell.removeEventListener('blur', onBlur);
//                     }, { once: true });
//                 });
//             });

//             row.querySelector('.delete-btn').addEventListener('click', () => deleteMember(parseInt(member.id_no)));

//             tableBody.appendChild(row);
//         });
//     }

//     function trackEdit(id, field, value) {
//         const memberIndex = allMembers.findIndex(m => m.id_no === id);
//         if (memberIndex !== -1) {
//             allMembers[memberIndex][field] = value;

//             const editedIndex = editedMembers.findIndex(m => m.id_no === id);
//             if (editedIndex !== -1) {
//                 editedMembers[editedIndex] = { ...allMembers[memberIndex] };
//             } else {
//                 editedMembers.push({ ...allMembers[memberIndex] });
//             }

//             saveBtn.disabled = false;
//         }
//     }

//     function updatePaginationInfo(totalItemsCount) {
//         startItem.textContent = ((currentPage - 1) * itemsPerPage) + 1;
//         endItem.textContent = Math.min(currentPage * itemsPerPage, totalItemsCount);
//         totalItems.textContent = totalItemsCount;
//     }

//     function updatePaginationControls() {
//         pageNumbers.innerHTML = '';
//         const addPageNumber = (page) => {
//             const pageElement = document.createElement('button');
//             pageElement.className = `page-number ${page === currentPage ? 'active' : ''}`;
//             pageElement.textContent = page;
//             pageElement.addEventListener('click', () => {
//                 currentPage = page;
//                 fetchMembers(searchInput.value, page);
//             });
//             pageNumbers.appendChild(pageElement);
//         };

//         addPageNumber(1);
//         const startPage = Math.max(2, currentPage - 2);
//         const endPage = Math.min(totalPages - 1, currentPage + 2);

//         if (startPage > 2) pageNumbers.innerHTML += '<span>...</span>';
//         for (let i = startPage; i <= endPage; i++) addPageNumber(i);
//         if (endPage < totalPages - 1) pageNumbers.innerHTML += '<span>...</span>';
//         if (totalPages > 1) addPageNumber(totalPages);

//         prevPage.disabled = currentPage === 1;
//         nextPage.disabled = currentPage === totalPages;
//         firstPage.disabled = currentPage === 1;
//         lastPage.disabled = currentPage === totalPages;
//     }

//     addRowBtn.addEventListener('click', async () => {
//         const maxId = Math.max(0, ...allMembers.map(m => m.id_no));
//         const newId = maxId + 1;
    
//         const today = new Date().toISOString().split('T')[0];
//         const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
//         const newMember = {
//             id_no: newId,
//             name: 'New Member',
//             email: 'email@example.com',
//             phone: '000-000-0000',
//             start_date: today,
//             end_date: nextYear,
//             isNew: true
//         };
    
//         try {
//             // 1. Send POST to the backend
//             const response = await fetch('http://localhost:4000/api/members', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newMember)
//             });
    
//             if (!response.ok) throw new Error('Failed to add member');
    
//             // 2. Update local state and UI
//             allMembers.unshift(newMember);
//             saveToLocalStorage(allMembers);
//             currentPage = 1;
//             fetchMembers(searchInput.value, currentPage);
//             alert('New member added successfully!');
//         } catch (err) {
//             console.error('Error adding member:', err);
//             alert('Failed to add member. Please try again.');
//         }
//     });

//     saveBtn.addEventListener('click', async () => {
//         try {
//             // No backend saving here, we’re simulating with localStorage
//             saveToLocalStorage(allMembers);
//             editedMembers = [];
//             saveBtn.disabled = true;
//             alert('Changes saved successfully!');
//         } catch (error) {
//             console.error('Error saving changes:', error);
//             alert('Error saving changes. Please try again.');
//         }
//     });

//     async function deleteMember(id) {
//         if (confirm('Are you sure you want to delete this member?')) {
//             allMembers = allMembers.filter(m => m.id_no !== id);
//             saveToLocalStorage(allMembers);
//             fetchMembers(searchInput.value, currentPage);
//         }
//     }

//     searchInput.addEventListener('input', function () {
//         currentPage = 1;
//         fetchMembers(this.value, currentPage);
//     });

//     prevPage.addEventListener('click', () => {
//         if (currentPage > 1) {
//             currentPage--;
//             fetchMembers(searchInput.value, currentPage);
//         }
//     });

//     nextPage.addEventListener('click', () => {
//         if (currentPage < totalPages) {
//             currentPage++;
//             fetchMembers(searchInput.value, currentPage);
//         }
//     });

//     firstPage.addEventListener('click', () => {
//         currentPage = 1;
//         fetchMembers(searchInput.value, currentPage);
//     });

//     lastPage.addEventListener('click', () => {
//         currentPage = totalPages;
//         fetchMembers(searchInput.value, currentPage);
//     });

//     // Load initial data
//     fetchMembers();
// });




document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const startItem = document.getElementById('startItem');
    const endItem = document.getElementById('endItem');
    const totalItems = document.getElementById('totalItems');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const firstPage = document.getElementById('firstPage');
    const lastPage = document.getElementById('lastPage');
    const addRowBtn = document.getElementById('addRowBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    

    //allmembers 
    let currentPage = 1;

    const itemsPerPage = 10;
    let totalPages = 1;
    let allMembers = []; //500000000000000 records  
    let editedMembers = [];


    // Local Storage Key
    const STORAGE_KEY = 'localMembers';
    //any, never, unknown, undefined
    function toggleLoading(isLoading) {
        if (loadingIndicator) {
            loadingIndicator.style.display = isLoading ? 'block' : 'none';
        }
    }

    

    function saveToLocalStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }


 

    async function fetchMembers(search = '', page = 1) {
        console.log(search);
        toggleLoading(true);
        try {
            allMembers = loadFromLocalStorage();
    
            // If localStorage is empty, fetch from backend
            if (allMembers.length === 0) {
                const res = await fetch('http://localhost:4000/api/members');
                if (!res.ok) throw new Error('Failed to fetch members from server');
                allMembers = await res.json();
                saveToLocalStorage(allMembers);
            } else {
                alert('running...')
            }
    
            if (search && search !== '') {
                allMembers = allMembers.filter(member =>
                    member.name.toLowerCase().includes(search.toLowerCase())
                );
            }
    
            totalPages = Math.ceil(allMembers.length / itemsPerPage);
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            renderTable(allMembers.slice(start, end));
            updatePaginationInfo(allMembers.length);
            updatePaginationControls();
        } catch (error) {
            console.error('Error loading members:', error);
        } finally {
            toggleLoading(false);
        }
    }
    

    function renderTable(members) {
        tableBody.innerHTML = '';
        members.forEach(member => {
            const row = document.createElement('tr');
            row.dataset.id = member.id_no;
            row.innerHTML = `
                <td>${member.id_no}</td>
                <td contenteditable="false" data-field="name">${member.name}</td>
                <td contenteditable="false" data-field="email">${member.email}</td>
                <td contenteditable="false" data-field="phone">${member.phone}</td>
                <td contenteditable="false" data-field="start_date">${member.start_date}</td>
                <td contenteditable="false" data-field="end_date">${member.end_date}</td>
                <td>
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Delete</button>
                </td>
            `;
    
            // Toggle editable when Edit is clicked
            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const editableCells = row.querySelectorAll('[contenteditable]');
                const isEditing = editableCells[0].getAttribute('contenteditable') === 'true';
    
                if (isEditing) {
                    // If currently editing, validate and then lock fields again
                    if (validateRow(row)) {
                        editableCells.forEach(cell => cell.setAttribute('contenteditable', 'false'));
                        editBtn.textContent = 'Edit';
                        saveBtn.disabled = false;  // Enable Save button
                    } else {
                        alert('Please correct validation errors before saving.');
                    }
                } else {
                    // Enable editing
                    editableCells.forEach(cell => cell.setAttribute('contenteditable', 'true'));
                    editBtn.textContent = 'Lock';
                }
            });
    
            // Track changes only when contenteditable is true (same as your original code)
            row.querySelectorAll('[contenteditable]').forEach(cell => {
                cell.addEventListener('focus', () => {
                    const originalValue = cell.textContent;
                    const id = parseInt(row.dataset.id);
                    cell.addEventListener('blur', function onBlur() {
                        const newValue = cell.textContent;
                        if (newValue !== originalValue) {
                            trackEdit(id, cell.dataset.field, newValue);
                        }
                        cell.removeEventListener('blur', onBlur);
                    }, { once: true });
                });
            });
    
            row.querySelector('.delete-btn').addEventListener('click', () => deleteMember(parseInt(member.id_no)));
    
            tableBody.appendChild(row);
        });
    }
    

    function validateRow(row) {
        const name = row.querySelector('[data-field="name"]').textContent.trim();
        const email = row.querySelector('[data-field="email"]').textContent.trim();
        const phone = row.querySelector('[data-field="phone"]').textContent.trim();
        const startDate = row.querySelector('[data-field="start_date"]').textContent.trim();
        const endDate = row.querySelector('[data-field="end_date"]').textContent.trim();
    
        const nameValid = /^[a-zA-Z\s]+$/.test(name) && name.length > 0;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const phoneValid = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/.test(phone);
        const startDateValid = !isNaN(Date.parse(startDate));
        const endDateValid = !isNaN(Date.parse(endDate));
    
        if (!nameValid) {
            alert('Invalid name. Only letters and spaces allowed.');
            return false;
        }
        if (!emailValid) {
            alert('Invalid email address.');
            return false;
        }
        if (!phoneValid) {
            alert('Invalid phone number. Format: 123-456-7890');
            return false;
        }
        if (!startDateValid) {
            alert('Invalid start date.');
            return false;
        }
        if (!endDateValid) {
            alert('Invalid end date.');
            return false;
        }
    
        // Optionally, check that endDate >= startDate
        if (new Date(endDate) < new Date(startDate)) {
            alert('End date cannot be before start date.');
            return false;
        }
    
        return true;
    }
    


    function trackEdit(id, field, value) {
        const memberIndex = allMembers.findIndex(m => m.id_no === id);
        if (memberIndex !== -1) {
            allMembers[memberIndex][field] = value;

            const editedIndex = editedMembers.findIndex(m => m.id_no === id);
            if (editedIndex !== -1) {
                editedMembers[editedIndex] = { ...allMembers[memberIndex] };
            } else {
                editedMembers.push({ ...allMembers[memberIndex] });
            }

            saveBtn.disabled = false;
        }
    }

    function updatePaginationInfo(totalItemsCount) {
        startItem.textContent = ((currentPage - 1) * itemsPerPage) + 1;
        endItem.textContent = Math.min(currentPage * itemsPerPage, totalItemsCount);
        totalItems.textContent = totalItemsCount;
    }

    function updatePaginationControls() {
        pageNumbers.innerHTML = '';
        const addPageNumber = (page) => {
            const pageElement = document.createElement('button');
            pageElement.className = `page-number ${page === currentPage ? 'active' : ''}`;
            pageElement.textContent = page;
            pageElement.addEventListener('click', () => {
                currentPage = page;
                fetchMembers(searchInput.value, page);
            });
            pageNumbers.appendChild(pageElement);
        };

        addPageNumber(1);
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        if (startPage > 2) pageNumbers.innerHTML += '<span>...</span>';
        for (let i = startPage; i <= endPage; i++) addPageNumber(i);
        if (endPage < totalPages - 1) pageNumbers.innerHTML += '<span>...</span>';
        if (totalPages > 1) addPageNumber(totalPages);

        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;
        firstPage.disabled = currentPage === 1;
        lastPage.disabled = currentPage === totalPages;
    }

    

    addRowBtn.addEventListener('click', async () => {
        const newMember = {
            name: 'New Member',
            email: 'email@example.com',
            phone: '000-000-0000'
        };
    
        try {
            const response = await fetch('http://localhost:4000/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMember)
            });
    
            if (!response.ok) throw new Error('Failed to add member');
    
            const addedMember = await response.json();  // <-- get the full member from backend
    
            allMembers.unshift(addedMember);  // <-- use this, not the original newMember
            saveToLocalStorage(allMembers);
            currentPage = 1;
            fetchMembers(searchInput.value, currentPage);
            // alert('successModal');
        } catch (err) {
            console.error('Error adding member:', err);
            // alert('errorModal');
        }
    });
    

    saveBtn.addEventListener('click', async () => {
        try {
            // 1. Send PUT to the backend for each edited member
            for (const editedMember of editedMembers) {
                const response = await fetch(`http://localhost:4000/api/members/${editedMember.id_no}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editedMember)
                });

                if (!response.ok) throw new Error(`Failed to update member ${editedMember.id_no}`);
            }

            // 2. Update localStorage
            saveToLocalStorage(allMembers);
            editedMembers = [];
            saveBtn.disabled = true;
            // alert('successModal');
        } catch (error) {
            console.error('Error saving changes:', error);
            // alert('errorModal');
        }
    });

    async function deleteMember(id) {
        const confirmed = confirm('Are you sure you want to delete this member?');
        if (!confirmed) return;
    
        try {
            const res = await fetch(`http://localhost:4000/api/members/${id}`, {
                method: 'DELETE'
            });
    
            if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
    
            allMembers = allMembers.filter(member => member.id_no !== id);
            saveToLocalStorage(allMembers);
            await fetchMembers(searchInput.value, currentPage);
            alert('Member deleted successfully!');
        } catch (error) {
            console.error('Delete Error:', error);
            alert('Failed to delete member. Please try again.');
        }
    }

    searchInput.addEventListener('input', function () {
        currentPage = 1;
        fetchMembers(this.value, currentPage);
    });

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMembers(searchInput.value, currentPage);
        }
    });

    nextPage.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMembers(searchInput.value, currentPage);
        }
    });

    firstPage.addEventListener('click', () => {
        currentPage = 1;
        fetchMembers(searchInput.value, currentPage);
    });

    lastPage.addEventListener('click', () => {
        currentPage = totalPages;
        fetchMembers(searchInput.value, currentPage);
    });

    // Load initial data
    fetchMembers();
});

// Show modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Add Row Button
const addRowBtn = document.getElementById('addRowBtn');
if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
        try {
            // Your logic for adding a row goes here...

            showModal('successModal');
        } catch (error) {
            showModal('errorModal');
        }
    });
}

// Save Button
const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        try {
            // Your logic for saving data goes here...

            showModal('successModal');
        } catch (error) {
            showModal('errorModal');
        }
    });
}

// Delete Button(s)
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
        try {
            // Your delete logic here...
            // Simulate success/failure:
            const isSuccessful = true; // or false for testing

            if (isSuccessful) {
                showModal('successModal');
            } else {
                showModal('errorModal');
            }
        } catch (error) {
            showModal('errorModal');
        }
    });
});