// import React from 'react';

// const Breadcrumb: React.FC = () => {
//   return (
//     <nav className="breadcrumb">
//       <div className="breadcrumb-item">
//         <a href="/" className="breadcrumb-link">Home</a>
//       </div>
//       <span className="breadcrumb-separator"> / </span>
//       <div className="breadcrumb-item">
//         <a href="/category" className="breadcrumb-link">Table</a>
//       </div>
//       <span className="breadcrumb-separator"> / </span>
//     </nav>
//   );
// }

// export default Breadcrumb;


import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = ' / ' }) => {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="breadcrumb-item">
            {item.path ? (
              <Link to={item.path} className="breadcrumb-link" style={{cursor:'pointer'}}>
                {item.label}
              </Link>
            ) : (
              <span style={{color:'grey'}}>{item.label}</span>
            )}
          </div>
          {index < items.length - 1 && (
            <span className="breadcrumb-separator">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
