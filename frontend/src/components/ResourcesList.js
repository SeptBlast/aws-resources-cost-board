import React, { useState } from 'react';
import './ResourcesList.css';

const ResourcesList = ({ ec2Instances, rdsInstances, ebsVolumes, cloudWatchLogGroups }) => {
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
  const sortedEBS = getSortedItems(ebsVolumes || []);
  const sortedLogGroups = getSortedItems(cloudWatchLogGroups || []);

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
        <button 
          className={activeTab === 'ebs' ? 'active' : ''} 
          onClick={() => setActiveTab('ebs')}
        >
          EBS Volumes ({(ebsVolumes || []).length})
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => setActiveTab('logs')}
        >
          Log Groups ({(cloudWatchLogGroups || []).length})
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

        {activeTab === 'ebs' && (
          <div className="ebs-list">
            {!ebsVolumes || sortedEBS.length === 0 ? (
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
                  {sortedEBS.map((volume) => (
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
                  {sortedLogGroups.map((logGroup) => (
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
    </div>
  );
};

export default ResourcesList;
