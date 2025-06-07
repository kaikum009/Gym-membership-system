audit trail
- modal for errors
- type validations on coloumns
- date component
- terminal loging
- log api calls,log database queries
- fix payment table relationship

api should contain pagination not frontend
frontend storing all members is wrong.


 // addRowBtn.addEventListener('click', async () => {
    //     const maxId = Math.max(0, ...allMembers.map(m => m.id_no));
    //     const newId = maxId + 1;
    
    //     const today = new Date().toISOString().split('T')[0];
    //     const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    //     const newMember = {
            // id_no: newId,
    //         name: 'New Member',
    //         email: 'email@example.com',
    //         phone: '000-000-0000',
    //         start_date: today,
    //         end_date: nextYear,
    //         isNew: true
    //     };
    
    //     try {
    //         // 1. Send POST to the backend
    //         const response = await fetch('http://localhost:4000/api/members', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(newMember)
    //         });
    
    //         if (!response.ok) throw new Error('Failed to add member');
    
    //         // 2. Update local state and UI
    //         allMembers.unshift(newMember);
    //         saveToLocalStorage(allMembers);
    //         currentPage = 1;
    //         fetchMembers(searchInput.value, currentPage);
    //         alert('New member added successfully!');
    //     } catch (err) {
    //         console.error('Error adding member:', err);
    //         alert('Failed to add member. Please try again.');
    //     }
    // });



<!-- front end api fetch -->
       // async function fetchMembers(search = '', page = 1) {
    //     console.log(search);//''
    //     toggleLoading(true);
    //     try {
    //         allMembers = loadFromLocalStorage();
    //         if (search && search !== '') { //undefined, null and has a search term
    //             allMembers = allMembers.filter(member =>
    //                 member.name.toLowerCase().includes(search.toLowerCase())
                
    //             );
    //         }

    //         //in api
    //         totalPages = Math.ceil(allMembers.length / itemsPerPage);
    //         const start = (page - 1) * itemsPerPage;
    //         const end = start + itemsPerPage;
    //         renderTable(allMembers.slice(start, end));
    //         updatePaginationInfo(allMembers.length);
    //         updatePaginationControls();
    //     } catch (error) {
    //         console.error('Error loading members:', error);
    //     } finally {
    //         toggleLoading(false);
    //     }
    // }



   <!-- // function renderTable(members) {
    //     tableBody.innerHTML = '';
    //     members.forEach(member => {
    //         const row = document.createElement('tr');
    //         row.dataset.id = member.id_no;
    //         row.innerHTML = `
    //             <td>${member.id_no}</td>
    //             <td contenteditable="true" data-field="name">${member.name}</td>
    //             <td contenteditable="true" data-field="email">${member.email}</td>
    //             <td contenteditable="true" data-field="phone">${member.phone}</td>
    //             <td contenteditable="true" data-field="start_date">${member.start_date}</td>
    //             <td contenteditable="true" data-field="end_date">${member.end_date}</td>
    //             <td><button class="action-btn delete-btn">Delete</button></td>
    //         `;

    //         row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
    //             cell.addEventListener('focus', () => {
    //                 const originalValue = cell.textContent;
    //                 const id = parseInt(row.dataset.id);
    //                 cell.addEventListener('blur', function onBlur() {
    //                     const newValue = cell.textContent;
    //                     if (newValue !== originalValue) {
    //                         trackEdit(id, cell.dataset.field, newValue);
    //                     }
    //                     cell.removeEventListener('blur', onBlur);
    //                 }, { once: true });
    //             });
    //         });

    //         row.querySelector('.delete-btn').addEventListener('click', () => deleteMember(parseInt(member.id_no)));

    //         tableBody.appendChild(row);
    //     });
    // } -->