let editModalInstance = null;

async function loadDepartments() {
  try {
    const res = await fetch('/departments');
    const result = await res.json();
    const tbody = document.getElementById('departmentsTableBody');
    tbody.innerHTML = '';

    if (result.success && result.data.length > 0) {
      result.data.forEach(dept => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${dept.id}</td>
          <td class="fw-semibold text-dark">${escapeHtml(dept.departmentName)}</td>
          <td>${new Date(dept.createdAt).toLocaleDateString()}</td>
          <td class="text-end">
            <div class="d-flex justify-content-end gap-1">
              <button class="btn btn-sm btn-outline-secondary" onclick="openEditModal(${dept.id}, '${escapeQuote(dept.departmentName)}')">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteDept(${dept.id})">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No departments found. Add one to get started!</td></tr>`;
    }
  } catch (err) {
    console.error(err);
  }
}

// Add Department
document.getElementById('addDeptForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const departmentName = document.getElementById('addDeptName').value;
  const feedback = document.getElementById('addDeptFeedback');
  feedback.innerText = '';
  document.getElementById('addDeptName').classList.remove('is-invalid');

  try {
    const response = await fetch('/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departmentName })
    });
    const result = await response.json();

    if (response.ok) {
      document.getElementById('addDeptName').value = '';
      const modal = bootstrap.Modal.getInstance(document.getElementById('addDeptModal'));
      modal.hide();
      loadDepartments();
    } else {
      document.getElementById('addDeptName').classList.add('is-invalid');
      feedback.innerText = result.message || 'Validation failed';
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});

// Open Edit Modal
window.openEditModal = function(id, name) {
  document.getElementById('editDeptId').value = id;
  document.getElementById('editDeptName').value = name;
  document.getElementById('editDeptName').classList.remove('is-invalid');
  document.getElementById('editDeptFeedback').innerText = '';
  editModalInstance = new bootstrap.Modal(document.getElementById('editDeptModal'));
  editModalInstance.show();
};

// Update Department
document.getElementById('editDeptForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editDeptId').value;
  const departmentName = document.getElementById('editDeptName').value;
  const feedback = document.getElementById('editDeptFeedback');
  feedback.innerText = '';
  document.getElementById('editDeptName').classList.remove('is-invalid');

  try {
    const response = await fetch('/departments/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departmentName })
    });
    const result = await response.json();

    if (response.ok) {
      editModalInstance.hide();
      loadDepartments();
    } else {
      document.getElementById('editDeptName').classList.add('is-invalid');
      feedback.innerText = result.message || 'Validation failed';
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
});

// Delete Department
window.deleteDept = async function(id) {
  if (!confirm('Are you sure you want to delete this department?')) return;

  try {
    const response = await fetch('/departments/' + id, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (response.ok) {
      loadDepartments();
    } else {
      alert(result.message || 'Failed to delete department');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
};

// Helpers
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function escapeQuote(str) {
  return str.replace(/'/g, "\\'");
}

window.addEventListener('DOMContentLoaded', loadDepartments);
