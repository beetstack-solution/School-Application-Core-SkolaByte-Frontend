import React from "react";
import AutoDropdown from "./AutoDropdown";

function StockTable() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mt-5">
<div className="flex items-center justify-around stocktable">
<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mt-5">
        <div className=" overflow-hidden border p-3">
          <div className="overflow-x-auto overflow-y-auto max-h-96">
          <div className="flex flex-wrap mb-5">
                <div className=" mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    From
                </label>
                <AutoDropdown />
                </div>
                </div>
            <table className="data_table">
              <thead className="bg-black-700 text-white">
                <tr>
                  <th>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Item Details
                    </div>
                  </th>
    
                  <th> Quantity</th>
                  <th>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Rate
                    </div>
                  </th>
                  <th>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Total
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 bgwhite  ">
                <tr>
                  <td>
                    <input
                      type="text"
                      className="sm:w-[150px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="sm:w-[60px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="sm:w-[100px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="sm:w-[120px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div> 

    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mt-5">
        <div className="overflow-hidden border p-3">
          <div className="overflow-x-auto overflow-y-auto max-h-96">
          <div className="flex flex-wrap mb-5">
                <div className=" mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    To
                </label>
                <AutoDropdown />
                </div>
                </div>
            <table className="data_table">
              <thead className="bg-black-700 text-white">
                <tr>
                  <th>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Item Details
                    </div>
                  </th>
    
                  <th> Quantity</th>
                  <th>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Rate
                    </div>
                  </th>
                  <th>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Total
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 bgwhite  ">
                <tr>
                  <td>
                    <input
                      type="text"
                      className="sm:w-[150px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="sm:w-[60px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="sm:w-[100px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="sm:w-[120px] p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
</div>
    </div>
  );
}

export default StockTable;
