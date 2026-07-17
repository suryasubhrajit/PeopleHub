let departments = [];
let employeesList = [];
let currentPage = 1;
const limit = 10;

// Load filter options
async function loadFilterOptions() {
  try {
    const res = await fetch('/departments');
    const result = await res.json();
    if (result.success) {
      departments = result.data;

      const filterSelect = document.getElementById('filterDepartment');
      const addSelect = document.getElementById('addDept');
      const editSelect = document.getElementById('editDept');

      filterSelect.innerHTML = '<option value="">All Departments</option>';
      addSelect.innerHTML = '<option value="">Select Department</option>';
      editSelect.innerHTML = '';

      departments.forEach(dept => {
        const opt = `<option value="${dept.id}">${escapeHtml(dept.departmentName)}</option>`;
        filterSelect.innerHTML += opt;
        addSelect.innerHTML += opt;
        editSelect.innerHTML += opt;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// Load Employees List
async function loadEmployees(page = 1) {
  currentPage = page;
  const search = document.getElementById('filterSearch').value;
  const departmentId = document.getElementById('filterDepartment').value;
  const status = document.getElementById('filterStatus').value;

  let url = `/employees?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (departmentId) url += `&departmentId=${departmentId}`;
  if (status) url += `&status=${status}`;

  try {
    const res = await fetch(url);
    const result = await res.json();
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';

    if (result.success && result.data.length > 0) {
      employeesList = result.data; // Save to global list
      result.data.forEach((emp, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="fw-bold text-secondary">${escapeHtml(emp.employeeCode)}</td>
          <td class="fw-semibold text-dark">${escapeHtml(emp.fullName)}</td>
          <td>${escapeHtml(emp.email)}</td>
          <td><span class="badge bg-secondary-subtle text-secondary">${escapeHtml(emp.departmentName || 'N/A')}</span></td>
          <td>${escapeHtml(emp.designation || 'N/A')}</td>
          <td>$${parseFloat(emp.salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          <td class="text-center">
            <button class="btn btn-sm badge ${emp.status === 'Active' ? 'bg-success' : 'bg-danger'} border-0 px-2.5 py-1.5" onclick="toggleStatus(${emp.id}, '${emp.status}')">
              ${emp.status}
            </button>
          </td>
          <td class="text-end">
            <div class="d-flex justify-content-end gap-1">
              <button class="btn btn-sm btn-outline-info" onclick="viewEmployee(${emp.id})">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary" onclick="openEditModalByIndex(${index})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee(${emp.id})">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
      setupPagination(result.pagination);
    } else {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No employees match your search criteria.</td></tr>`;
      document.getElementById('paginationNav').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
  }
}

// Pagination
function setupPagination(pagination) {
  const nav = document.getElementById('paginationNav');
  const list = document.getElementById('paginationList');
  list.innerHTML = '';

  if (pagination.totalPages > 1) {
    nav.style.display = 'block';

    // Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${pagination.page === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="loadEmployees(${pagination.page - 1})">Previous</a>`;
    list.appendChild(prevLi);

    // Numeric Pages
    for (let i = 1; i <= pagination.totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${pagination.page === i ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#" onclick="loadEmployees(${i})">${i}</a>`;
      list.appendChild(li);
    }

    // Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="loadEmployees(${pagination.page + 1})">Next</a>`;
    list.appendChild(nextLi);
  } else {
    nav.style.display = 'none';
  }
}

// Toggle Status
window.toggleStatus = async function(id, currentStatus) {
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  try {
    const res = await fetch(`/employees/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadEmployees(currentPage);
    } else {
      const result = await res.json();
      alert(result.message || 'Failed to update status');
    }
  } catch (err) {
    console.error(err);
  }
};

// Delete Employee
window.deleteEmployee = async function(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return;
  try {
    const res = await fetch(`/employees/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadEmployees(currentPage);
    } else {
      const result = await res.json();
      alert(result.message || 'Failed to delete employee');
    }
  } catch (err) {
    console.error(err);
  }
};

// View Details
window.viewEmployee = async function(id) {
  const container = document.getElementById('viewEmpBody');
  container.innerHTML = `<div class="text-center my-3"><div class="spinner-border text-primary" role="status"></div></div>`;
  const modal = new bootstrap.Modal(document.getElementById('viewEmpModal'));
  modal.show();

  try {
    const res = await fetch('/employees/' + id);
    const result = await res.json();
    if (res.ok) {
      const emp = result.data;
      container.innerHTML = `
        <div class="row g-3">
          <div class="col-6"><strong>Code:</strong><br>${escapeHtml(emp.employeeCode)}</div>
          <div class="col-6"><strong>Status:</strong><br><span class="badge ${emp.status === 'Active' ? 'bg-success' : 'bg-danger'}">${emp.status}</span></div>
          <div class="col-12"><strong>Full Name:</strong><br>${escapeHtml(emp.fullName)}</div>
          <div class="col-12"><strong>Email Address:</strong><br>${escapeHtml(emp.email)}</div>
          <div class="col-6"><strong>Mobile:</strong><br>${escapeHtml(emp.mobile || 'N/A')}</div>
          <div class="col-6"><strong>Department:</strong><br>${escapeHtml(emp.departmentName || 'N/A')}</div>
          <div class="col-6"><strong>Designation:</strong><br>${escapeHtml(emp.designation || 'N/A')}</div>
          <div class="col-6"><strong>Salary:</strong><br>$${parseFloat(emp.salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div class="col-12 text-muted small"><strong>Created At:</strong><br>${new Date(emp.createdAt).toLocaleString()}</div>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="alert alert-danger">${result.message || 'Failed to load employee details'}</div>`;
    }
  } catch (err) {
    console.error(err);
  }
};

// Add modal setup
window.prepareAddModal = function() {
  document.getElementById('addEmpForm').reset();
  document.getElementById('addAlertsContainer').innerHTML = '';
};

// Save Employee Form Submission
document.getElementById('addEmpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertContainer = document.getElementById('addAlertsContainer');
  alertContainer.innerHTML = '';

  const data = {
    employeeCode: document.getElementById('addCode').value,
    fullName: document.getElementById('addName').value,
    email: document.getElementById('addEmail').value,
    mobile: document.getElementById('addMobile').value,
    departmentId: parseInt(document.getElementById('addDept').value),
    designation: document.getElementById('addDesignation').value,
    salary: parseFloat(document.getElementById('addSalary').value) || 0,
    status: document.getElementById('addStatus').value
  };

  try {
    const response = await fetch('/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (response.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('addEmpModal'));
      modal.hide();
      loadEmployees();
    } else {
      const errorList = result.errors ? result.errors.map(err => `<li>${err.message}</li>`).join('') : `<li>${result.message}</li>`;
      alertContainer.innerHTML = `<div class="alert alert-danger"><ul>${errorList}</ul></div>`;
    }
  } catch (err) {
    console.error(err);
  }
});

let editModalInstance = null;

// Helper to open edit modal using employee array index
window.openEditModalByIndex = function(index) {
  const emp = employeesList[index];
  openEditModal(emp);
};

// Open Edit Modal
function openEditModal(emp) {
  document.getElementById('editEmpId').value = emp.id;
  document.getElementById('editCode').value = emp.employeeCode;
  document.getElementById('editName').value = emp.fullName;
  document.getElementById('editEmail').value = emp.email;
  document.getElementById('editMobile').value = emp.mobile || '';
  document.getElementById('editDept').value = emp.departmentId || '';
  document.getElementById('editDesignation').value = emp.designation || '';
  document.getElementById('editSalary').value = emp.salary || 0;
  document.getElementById('editStatus').value = emp.status;

  document.getElementById('editAlertsContainer').innerHTML = '';
  editModalInstance = new bootstrap.Modal(document.getElementById('editEmpModal'));
  editModalInstance.show();
}

// Save Edit Form
document.getElementById('editEmpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editEmpId').value;
  const alertContainer = document.getElementById('editAlertsContainer');
  alertContainer.innerHTML = '';

  const data = {
    employeeCode: document.getElementById('editCode').value,
    fullName: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    mobile: document.getElementById('editMobile').value,
    departmentId: parseInt(document.getElementById('editDept').value),
    designation: document.getElementById('editDesignation').value,
    salary: parseFloat(document.getElementById('editSalary').value) || 0,
    status: document.getElementById('editStatus').value
  };

  try {
    const response = await fetch('/employees/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (response.ok) {
      editModalInstance.hide();
      loadEmployees(currentPage);
    } else {
      const errorList = result.errors ? result.errors.map(err => `<li>${err.message}</li>`).join('') : `<li>${result.message}</li>`;
      alertContainer.innerHTML = `<div class="alert alert-danger"><ul>${errorList}</ul></div>`;
    }
  } catch (err) {
    console.error(err);
  }
});

// Apply Filter Submit
document.getElementById('filterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  loadEmployees(1);
});

// Export CSV
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  const search = document.getElementById('filterSearch').value;
  const departmentId = document.getElementById('filterDepartment').value;
  const status = document.getElementById('filterStatus').value;

  let url = `/employees/export?1=1`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (departmentId) url += `&departmentId=${departmentId}`;
  if (status) url += `&status=${status}`;

  window.location.href = url;
});

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadFilterOptions();
  await loadEmployees();
});
