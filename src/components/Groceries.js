import React from 'react';
import { jsPDF } from 'jspdf';
import { useUser } from '../contexts/UserContext';
import MobileFrame from './MobileFrame';
import './Groceries.css';

const Groceries = () => {
  const { groceryList, toggleGroceryItem, checkAllGroceries } = useUser();
  const totalItems = groceryList.length;
  const checkedItems = groceryList.filter(item => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const marginLeft = 40;
    let cursorY = 56;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Yum&GO - Grocery List', marginLeft, cursorY);
    cursorY += 16;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(new Date().toLocaleString(), marginLeft, cursorY);
    doc.setTextColor(0);
    cursorY += 20;

    // Table header background
    doc.setFillColor(245, 245, 245);
    doc.rect(marginLeft, cursorY - 12, 515, 24, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Done', marginLeft + 6, cursorY);
    doc.text('Item', marginLeft + 70, cursorY);
    doc.text('Amount', marginLeft + 320, cursorY);
    doc.text('Unit', marginLeft + 420, cursorY);
    doc.setFont('helvetica', 'normal');
    cursorY += 8;

    const lineHeight = 20;
    groceryList.forEach((item) => {
      cursorY += lineHeight;
      if (cursorY > 770) {
        doc.addPage();
        cursorY = 56;
      }
      doc.text(item.checked ? '✔' : '', marginLeft + 6, cursorY);
      doc.text(String(item.name || ''), marginLeft + 70, cursorY, { maxWidth: 230 });
      doc.text(String(item.amount ?? ''), marginLeft + 320, cursorY);
      doc.text(String(item.unit || ''), marginLeft + 420, cursorY);
    });

    const date = new Date().toISOString().slice(0,10);
    doc.save(`grocery-list-${date}.pdf`);
  };

  const exportToCSV = () => {
    const header = ['checked', 'name', 'amount', 'unit'];
    const lines = [header.join(',')];
    groceryList.forEach(item => {
      const row = [
        item.checked ? 'true' : 'false',
        '"' + String(item.name || '').replace(/"/g, '""') + '"',
        item.amount ?? '',
        '"' + String(item.unit || '').replace(/"/g, '""') + '"'
      ];
      lines.push(row.join(','));
    });

    const csvContent = '\uFEFF' + lines.join('\n'); // BOM for Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0,10);
    link.download = `grocery-list-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MobileFrame>
      <div className="groceries-content">
        <div className="groceries-header">
          <h1>Grocery List</h1>
          <p>Your shopping list generated from your meal plan</p>
        </div>

        {groceryList.length === 0 ? (
          <div className="empty-state">
            <h3>No items in your grocery list</h3>
            <p>Add some meals to your planner to automatically generate your shopping list!</p>
            <button 
              className="planner-btn"
              onClick={() => window.location.href = '/planner'}
            >
              Go to Planner
            </button>
          </div>
        ) : (
          <>
            <div className="progress-section">
              <div className="progress-header">
                <h3>Shopping Progress</h3>
                <span className="progress-text">{checkedItems} of {totalItems} items</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="actions-section">
              <button 
                className="action-btn check-all"
                onClick={checkAllGroceries}
                disabled={checkedItems === totalItems}
              >
                Check All
              </button>
              <button 
                className="action-btn export-pdf"
                onClick={exportToPDF}
              >
                Export PDF
              </button>
              <button 
                className="action-btn export-csv"
                onClick={exportToCSV}
              >
                Export CSV
              </button>
            </div>

            <div className="grocery-list">
              {groceryList.map((item) => (
                <div 
                  key={item.id} 
                  className={`grocery-item ${item.checked ? 'checked' : ''}`}
                  onClick={() => toggleGroceryItem(item.id)}
                >
                  <div className="item-checkbox">
                    <input 
                      type="checkbox" 
                      checked={item.checked}
                      onChange={() => toggleGroceryItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">
                      {item.amount} {item.unit || ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MobileFrame>
  );
};

export default Groceries;
