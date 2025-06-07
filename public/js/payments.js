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
//     let allPayments = []; // Assuming payments data  
//     let editedPayments = [];

//     // Local Storage Key
//     const STORAGE_KEY = 'localPayments';

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

//     // async function fetchPayments(search = '', page = 1) {
//     //     console.log(search); // Empty string by default
//     //     toggleLoading(true);
//     //     try {
//     //         allPayments = loadFromLocalStorage();
//     //         if (allPayments.length === 0) {
//     //             const res = await fetch('http://localhost:4000/api/payments');
//     //             if (!res.ok) throw new Error('Failed to fetch payments from backend');
//     //             allPayments = await res.json();
//     //             saveToLocalStorage(allPayments);
//     //         }

//     //         totalPages = Math.ceil(allPayments.length / itemsPerPage);
//     //         const start = (page - 1) * itemsPerPage;
//     //         const end = start + itemsPerPage;
//     //         renderTable(allPayments.slice(start, end));
//     //         updatePaginationInfo(allPayments.length);
//     //         updatePaginationControls();
//     //     } catch (error) {
//     //         console.error('Error loading payments:', error);
//     //     } finally {
//     //         toggleLoading(false);
//     //     }
//     // }

//     async function fetchPayments(search = '', page = 1) {
//         console.log(search); // Optional: for debugging
//         toggleLoading(true);
//         try {
//             allPayments = loadFromLocalStorage();
//             if (allPayments.length === 0) {
//                 const res = await fetch('http://localhost:4000/api/payments');
//                 if (!res.ok) throw new Error('Failed to fetch payments from backend');
//                 allPayments = await res.json();
//                 saveToLocalStorage(allPayments);
//             }
    
//             // Filtering logic
//             let filteredPayments = allPayments;
//             if (search) {
//                 const lowerSearch = search.toLowerCase();
//                 filteredPayments = allPayments.filter(p =>
//                     Object.values(p).some(val =>
//                         String(val).toLowerCase().includes(lowerSearch)
//                     )
//                 );
//             }
    
//             // Pagination logic using filteredPayments
//             totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
//             const start = (page - 1) * itemsPerPage;
//             const end = start + itemsPerPage;
    
//             renderTable(filteredPayments.slice(start, end));
//             updatePaginationInfo(filteredPayments.length);
//             updatePaginationControls();
//         } catch (error) {
//             console.error('Error loading payments:', error);
//         } finally {
//             toggleLoading(false);
//         }
//     }
    

//     function renderTable(payments) {
//         tableBody.innerHTML = '';
//         payments.forEach(payment => {
//             const row = document.createElement('tr');
//             row.dataset.id = payment.payment_id;
//             row.innerHTML = `
//                 <td>${payment.payment_id}</td>
//                 <td contenteditable="true" data-field="amount">${payment.amount}</td>
//                 <td contenteditable="true" data-field="payment_date">${payment.payment_date}</td>
//                 <td contenteditable="true" data-field="payment_method">${payment.payment_method}</td>
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

//             row.querySelector('.delete-btn').addEventListener('click', () => deletePayment(parseInt(payment.payment_id)));

//             tableBody.appendChild(row);
//         });
//     }

//     function trackEdit(id, field, value) {
//         const paymentIndex = allPayments.findIndex(p => p.payment_id === id);
//         if (paymentIndex !== -1) {
//             allPayments[paymentIndex][field] = value;

//             const editedIndex = editedPayments.findIndex(p => p.payment_id === id);
//             if (editedIndex !== -1) {
//                 editedPayments[editedIndex] = { ...allPayments[paymentIndex] };
//             } else {
//                 editedPayments.push({ ...allPayments[paymentIndex] });
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
//                 fetchPayments(searchInput.value, page);
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
//         const maxId = Math.max(0, ...allPayments.map(p => p.payment_id));
//         const newId = maxId + 1;

//         const today = new Date().toISOString().split('T')[0];

//         const newPayment = {
//             payment_id: newId,
//             amount: '$0',
//             payment_date: today,
//             payment_method: 'Credit-card',
//             isNew: true
//         };

//         try {
//             const response = await fetch('http://localhost:4000/api/payment', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newPayment)
//             });

//             if (!response.ok) throw new Error('Failed to add payment');

//             allPayments.unshift(newPayment);
//             saveToLocalStorage(allPayments);
//             currentPage = 1;
//             fetchPayments(searchInput.value, currentPage);
//             alert('New payment added successfully!');
//         } catch (err) {
//             console.error('Error adding payment:', err);
//             alert('Failed to add payment. Please try again.');
//         }
//     });

//     saveBtn.addEventListener('click', async () => {
//         try {
//             for (const editedPayment of editedPayments) {
//                 const response = await fetch(`http://localhost:4000/api/payment/${editedPayment.payment_id}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(editedPayment)
//                 });

//                 if (!response.ok) throw new Error(`Failed to update payment ${editedPayment.payment_id}`);
//             }

//             saveToLocalStorage(allPayments);
//             editedPayments = [];
//             saveBtn.disabled = true;
//             alert('Changes saved successfully!');
//         } catch (error) {
//             console.error('Error saving changes:', error);
//             alert('Error saving changes. Please try again.');
//         }
//     });

//     async function deletePayment(id) {
//         const confirmed = confirm('Are you sure you want to delete this payment?');
//         if (!confirmed) return;

//         try {
//             const res = await fetch(`http://localhost:4000/api/payment/${id}`, {
//                 method: 'DELETE'
//             });

//             if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

//             allPayments = allPayments.filter(payment => payment.payment_id !== id);
//             saveToLocalStorage(allPayments);
//             await fetchPayments(searchInput.value, currentPage);
//             alert('Payment deleted successfully!');
//         } catch (error) {
//             console.error('Delete Error:', error);
//             alert('Failed to delete payment. Please try again.');
//         }
//     }

//     searchInput.addEventListener('input', function () {
//         currentPage = 1;
//         fetchPayments(this.value, currentPage);
//     });

//     prevPage.addEventListener('click', () => {
//         if (currentPage > 1) {
//             currentPage--;
//             fetchPayments(searchInput.value, currentPage);
//         }
//     });

//     nextPage.addEventListener('click', () => {
//         if (currentPage < totalPages) {
//             currentPage++;
//             fetchPayments(searchInput.value, currentPage);
//         }
//     });

//     firstPage.addEventListener('click', () => {
//         currentPage = 1;
//         fetchPayments(searchInput.value, currentPage);
//     });

//     lastPage.addEventListener('click', () => {
//         currentPage = totalPages;
//         fetchPayments(searchInput.value, currentPage);
//     });

//     fetchPayments(); // Initial data load
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
  
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalPages = 1;
    let allPayments = [];
    let editedPayments = [];
  
    const STORAGE_KEY = 'localPayments';
  
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
  
    async function fetchPayments(search = '', page = 1) {
      toggleLoading(true);
      try {
        allPayments = loadFromLocalStorage();
  
        if (allPayments.length === 0) {
          const res = await fetch('http://localhost:4000/api/payments');
          if (!res.ok) throw new Error('Failed to fetch payments');
          allPayments = await res.json();
          saveToLocalStorage(allPayments);
        }
  
        let filtered = allPayments;
        if (search) {
          filtered = filtered.filter(p =>
            Object.values(p).some(val =>
              String(val).toLowerCase().includes(search.toLowerCase())
            )
          );
        }
  
        totalPages = Math.ceil(filtered.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        renderTable(filtered.slice(start, end));
        updatePaginationInfo(filtered.length);
        updatePaginationControls();
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        toggleLoading(false);
      }
    }
  
    function renderTable(payments) {
      tableBody.innerHTML = '';
      payments.forEach(payment => {
        const row = document.createElement('tr');
        row.dataset.id = payment.payment_id;
        row.innerHTML = `
          <td>${payment.payment_id}</td>
          <td contenteditable="false" data-field="amount">${payment.amount}</td>
          <td contenteditable="false" data-field="payment_date">${payment.payment_date}</td>
          <td contenteditable="false" data-field="payment_method">${payment.payment_method}</td>
          <td>
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn delete-btn">Delete</button>
          </td>
        `;
  
        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
          const editableCells = row.querySelectorAll('[contenteditable]');
          const isEditing = editableCells[0].getAttribute('contenteditable') === 'true';
  
          if (isEditing) {
            editableCells.forEach(cell => cell.setAttribute('contenteditable', 'false'));
            editBtn.textContent = 'Edit';
            saveBtn.disabled = false;
          } else {
            editableCells.forEach(cell => cell.setAttribute('contenteditable', 'true'));
            editBtn.textContent = 'Lock';
          }
        });
  
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
  
        row.querySelector('.delete-btn').addEventListener('click', () => deletePayment(parseInt(payment.payment_id)));
  
        tableBody.appendChild(row);
      });
    }
  
    function trackEdit(id, field, value) {
      const index = allPayments.findIndex(p => p.payment_id === id);
      if (index !== -1) {
        allPayments[index][field] = value;
  
        const editedIndex = editedPayments.findIndex(p => p.payment_id === id);
        if (editedIndex !== -1) {
          editedPayments[editedIndex] = { ...allPayments[index] };
        } else {
          editedPayments.push({ ...allPayments[index] });
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
        const btn = document.createElement('button');
        btn.className = `page-number ${page === currentPage ? 'active' : ''}`;
        btn.textContent = page;
        btn.addEventListener('click', () => {
          currentPage = page;
          fetchPayments(searchInput.value, page);
        });
        pageNumbers.appendChild(btn);
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
      const maxId = Math.max(0, ...allPayments.map(p => p.payment_id));
      const newId = maxId + 1;
      const today = new Date().toISOString().split('T')[0];
  
      const newPayment = {
        payment_id: newId,
        amount: '$0',
        payment_date: today,
        payment_method: 'Credit-card',
      };
  
      try {
        const res = await fetch('http://localhost:4000/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPayment)
        });
  
        if (!res.ok) throw new Error('Failed to add payment');
  
        allPayments.unshift(newPayment);
        saveToLocalStorage(allPayments);
        currentPage = 1;
        fetchPayments(searchInput.value, currentPage);
        showModal('successModal');
      } catch (err) {
        console.error('Add error:', err);
        showModal('errorModal');
      }
    });
  
    saveBtn.addEventListener('click', async () => {
      try {
        for (const payment of editedPayments) {
          const res = await fetch(`http://localhost:4000/api/payment/${payment.payment_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment)
          });
          if (!res.ok) throw new Error(`Failed to update payment ${payment.payment_id}`);
        }
  
        saveToLocalStorage(allPayments);
        editedPayments = [];
        saveBtn.disabled = true;
        showModal('successModal');
      } catch (err) {
        console.error('Save error:', err);
        showModal('errorModal');
      }
    });
  
    async function deletePayment(id) {
      if (!confirm('Are you sure you want to delete this payment?')) return;
      try {
        const res = await fetch(`http://localhost:4000/api/payment/${id}`, {
          method: 'DELETE'
        });
  
        if (!res.ok) throw new Error(`Failed to delete payment`);
  
        allPayments = allPayments.filter(p => p.payment_id !== id);
        saveToLocalStorage(allPayments);
        fetchPayments(searchInput.value, currentPage);
        showModal('successModal');
      } catch (err) {
        console.error('Delete error:', err);
        showModal('errorModal');
      }
    }
  
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      fetchPayments(searchInput.value, currentPage);
    });
  
    prevPage.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchPayments(searchInput.value, currentPage);
      }
    });
  
    nextPage.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchPayments(searchInput.value, currentPage);
      }
    });
  
    firstPage.addEventListener('click', () => {
      currentPage = 1;
      fetchPayments(searchInput.value, currentPage);
    });
  
    lastPage.addEventListener('click', () => {
      currentPage = totalPages;
      fetchPayments(searchInput.value, currentPage);
    });
  
    fetchPayments(); // Initial load
  });
  
  // ✅ Modal functions
  function showModal(id) {
    document.getElementById(id).style.display = 'flex';
  }
  
  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }
  