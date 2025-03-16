import React, { useState } from 'react';
import './ResourcesList.css';

const ResourcesList = ({ ec2Instances, rdsInstances }) => {
  const [activeTab, setActiveTab] = useState('ec2');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

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

  const sortedEC2 = getSortedItems(ec2Instances);
  const sortedRDS = getSortedItems(rdsInstances);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <div className="resources-list">
      <div className="tabs">
        <button 
          className={activeTab === 'ec2' ? 'active' : ''} 
          onClick={() => setActiveTab('ec2')}
        >
          EC2 Instances ({ec2Instances.length})
        </button>
        <button 
          className={activeTab === 'rds' ? 'active' : ''} 
          onClick={() => setActiveTab('rds')}
        >
          RDS Instances ({rdsInstances.length})
        </button>
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
                  {sortedEC2.map((instance) => (
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
                  {sortedRDS.map((instance) => (
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
      </div>
    </div>
  );
};

export default ResourcesList;
