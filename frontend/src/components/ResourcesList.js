import React, { useState } from 'react';
import './ResourcesList.css';

const ResourcesList = ({ ec2Instances = [], rdsInstances = [], ebsVolumes = [], cloudWatchLogGroups = [] }) => {
  const [activeTab, setActiveTab] = useState('ec2');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get sorted data for each resource type
  const sortedEC2 = getSortedItems(ec2Instances || []);
  const sortedRDS = getSortedItems(rdsInstances || []);
  const sortedEBS = getSortedItems(ebsVolumes || []);
  const sortedLogGroups = getSortedItems(cloudWatchLogGroups || []);
  
  // Get current items based on pagination
  const getCurrentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };
  
  // Get paginated data
  const currentEC2 = getCurrentItems(sortedEC2);
  const currentRDS = getCurrentItems(sortedRDS);
  const currentEBS = getCurrentItems(sortedEBS);
  const currentLogGroups = getCurrentItems(sortedLogGroups);
  
  // Calculate total pages for the active tab
  const getActiveTabItems = () => {
    switch (activeTab) {
      case 'ec2': return sortedEC2;
      case 'rds': return sortedRDS;
      case 'ebs': return sortedEBS;
      case 'logs': return sortedLogGroups;
      default: return [];
    }
  };
  
  const totalPages = Math.ceil(getActiveTabItems().length / itemsPerPage);
  
  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Handle tab changes (reset pagination when tab changes)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Format bytes to human readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Create pagination buttons
  const renderPaginationControls = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &laquo; Prev
      </button>
    );
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "pagination-button active" : "pagination-button"}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="pagination-button"
      >
        Next &raquo;
      </button>
    );
    
    return pages;
  };

  return (
    <div className="resources-list">
      <div className="tabs">
        <button 
          className={activeTab === 'ec2' ? 'active' : ''} 
          onClick={() => handleTabChange('ec2')}
        >
          EC2 Instances ({(ec2Instances || []).length})
        </button>
        <button 
          className={activeTab === 'rds' ? 'active' : ''} 
          onClick={() => handleTabChange('rds')}
        >
          RDS Instances ({(rdsInstances || []).length})
        </button>
        <button 
          className={activeTab === 'ebs' ? 'active' : ''} 
          onClick={() => handleTabChange('ebs')}
        >
          EBS Volumes ({(ebsVolumes || []).length})
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => handleTabChange('logs')}
        >
          Log Groups ({(cloudWatchLogGroups || []).length})
        </button>
      </div>

      <div className="table-controls">
        <div className="pagination-info">
          Showing {getActiveTabItems().length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, getActiveTabItems().length)} of {getActiveTabItems().length} entries
        </div>
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select 
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'ec2' && (
          <div className="ec2-list">
            {sortedEC2.length === 0 ? (
              <p>No EC2 instances found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>
                      Name{getSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('id')}>
                      Instance ID{getSortIcon('id')}
                    </th>
                    <th onClick={() => handleSort('type')}>
                      Type{getSortIcon('type')}
                    </th>
                    <th onClick={() => handleSort('state')}>
                      State{getSortIcon('state')}
                    </th>
                    <th onClick={() => handleSort('launchTime')}>
                      Launch Time{getSortIcon('launchTime')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEC2.map((instance) => (
                    <tr key={instance.id}>
                      <td>{instance.name || '-'}</td>
                      <td>{instance.id}</td>
                      <td>{instance.type}</td>
                      <td>{instance.state}</td>
                      <td>{new Date(instance.launchTime).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'rds' && (
          <div className="rds-list">
            {sortedRDS.length === 0 ? (
              <p>No RDS instances found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>
                      Identifier{getSortIcon('id')}
                    </th>
                    <th onClick={() => handleSort('class')}>
                      Instance Class{getSortIcon('class')}
                    </th>
                    <th onClick={() => handleSort('engine')}>
                      Engine{getSortIcon('engine')}
                    </th>
                    <th onClick={() => handleSort('engineVersion')}>
                      Version{getSortIcon('engineVersion')}
                    </th>
                    <th onClick={() => handleSort('status')}>
                      Status{getSortIcon('status')}
                    </th>
                    <th onClick={() => handleSort('allocatedStorage')}>
                      Storage (GB){getSortIcon('allocatedStorage')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRDS.map((instance) => (
                    <tr key={instance.id}>
                      <td>{instance.id}</td>
                      <td>{instance.class}</td>
                      <td>{instance.engine}</td>
                      <td>{instance.engineVersion}</td>
                      <td>{instance.status}</td>
                      <td>{instance.allocatedStorage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'ebs' && (
          <div className="ebs-list">
            {(!ebsVolumes || sortedEBS.length === 0) ? (
              <p>No EBS volumes found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>
                      Volume ID{getSortIcon('id')}
                    </th>
                    <th onClick={() => handleSort('name')}>
                      Name{getSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('size')}>
                      Size (GB){getSortIcon('size')}
                    </th>
                    <th onClick={() => handleSort('volumeType')}>
                      Type{getSortIcon('volumeType')}
                    </th>
                    <th onClick={() => handleSort('state')}>
                      State{getSortIcon('state')}
                    </th>
                    <th onClick={() => handleSort('attachedTo')}>
                      Attached To{getSortIcon('attachedTo')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEBS.map((volume) => (
                    <tr key={volume.id}>
                      <td>{volume.id}</td>
                      <td>{volume.name || '-'}</td>
                      <td>{volume.size}</td>
                      <td>{volume.volumeType}</td>
                      <td>{volume.state}</td>
                      <td>{volume.attachedTo || 'Not attached'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="log-groups-list">
            {!cloudWatchLogGroups || sortedLogGroups.length === 0 ? (
              <p>No CloudWatch Log Groups found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>
                      Name{getSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('storedBytes')}>
                      Storage Used{getSortIcon('storedBytes')}
                    </th>
                    <th onClick={() => handleSort('retentionDays')}>
                      Retention (Days){getSortIcon('retentionDays')}
                    </th>
                    <th onClick={() => handleSort('creationTime')}>
                      Created{getSortIcon('creationTime')}
                    </th>
                    <th onClick={() => handleSort('metricFilterCount')}>
                      Metric Filters{getSortIcon('metricFilterCount')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogGroups.map((logGroup) => (
                    <tr key={logGroup.name}>
                      <td>{logGroup.name}</td>
                      <td>{formatBytes(logGroup.storedBytes)}</td>
                      <td>{logGroup.retentionDays > 0 ? logGroup.retentionDays : 'Never expires'}</td>
                      <td>{new Date(logGroup.creationTime).toLocaleString()}</td>
                      <td>{logGroup.metricFilterCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      
      {getActiveTabItems().length > 0 && (
        <div className="pagination">
          {renderPaginationControls()}
        </div>
      )}
    </div>
  );
};

export default ResourcesList;
