function renderMindMap(parsedData) {
  const container = document.getElementById('mindMap');
  if (!container) {
    console.error('Element #mindMap not found.');
    return;
  }

  container.innerHTML = '';

  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    container.innerHTML = '<p>No data to display.</p>';
    return;
  }

  console.log('Rendering parsed data:', parsedData); // debug output

  parsedData.forEach(file => {
    const fileDiv = document.createElement('div');
    fileDiv.classList.add('file-block');

    const functions = Array.isArray(file.functions) ? file.functions.join(', ') : 'None';
    const variables = Array.isArray(file.variables) ? file.variables.join(', ') : 'None';

    const classListHTML = (file.classes || []).map(cls => {
      const name = cls?.name || '[Unnamed Class]';
      const methodsHTML = (cls?.methods || []).map(m => `<li>${m}()</li>`).join('');
      const parentInfo = cls?.parent ? `<em> (extends ${cls.parent})</em>` : '';
      return `
        <li>
          <strong>${name}</strong>${parentInfo}
          ${methodsHTML ? `<ul>${methodsHTML}</ul>` : ''}
        </li>`;
    }).join('');

    fileDiv.innerHTML = `
      <h3>${file.file || '[Unknown File]'}</h3>
      <p><strong>Functions:</strong> ${functions}</p>
      <p><strong>Variables:</strong> ${variables}</p>
      <p><strong>Classes:</strong></p>
      <ul>${classListHTML || '<li>None</li>'}</ul>
    `;

    container.appendChild(fileDiv);
  });
}
window.renderMindMap = renderMindMap;