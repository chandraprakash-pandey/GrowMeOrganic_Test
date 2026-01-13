import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import axios from "axios";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

interface Product {
  id: number;
  title?: string;
  place_of_origin?: string;
  artist_title?: string;
  inscriptions?: string;
  date_start?: number;
  date_end?: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const rows = 12;
  const [userPageNo, setUserPageNo] = useState<number | "">("");

  const loadData = async (pageIndex: number) => {
    setLoading(true);
    try {
      const apiPage = Math.floor(pageIndex / rows) + 1;
      const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${apiPage}&limit=${rows}`);

      setProducts(res.data.data);
      setTotalRecords(res.data.pagination.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(first);
  }, [first]);

  const onPageChange = (event: any) => {
    setFirst(event.first);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userPageNo === "") {
      alert("Please enter a number");
      return;
    } else {
      const newSelectedProduct = products.slice(0, userPageNo);
      setSelectedProducts(newSelectedProduct);
      setUserPageNo("");
    }

    console.log("Submitted value:", userPageNo);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <div className="px-4 py-2 bg-indigo-50 rounded-lg">
            <span className="text-indigo-700 font-semibold">
              {selectedProducts?.length || 0} items selected
            </span>

          </div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 w-fit">
            <div className="flex flex-col gap-1">
              <label htmlFor="pageNo" className="text-xs font-semibold text-gray-600 uppercase">
                Rows per page
              </label>
              <input
                id="pageNo"
                type="number"
                value={userPageNo}
                onChange={(e) => setUserPageNo(Number(e.target.value))}
                placeholder="e.g. 10"
                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-32"/>
            </div>

            <button
              type="submit"
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm active:transform active:scale-95">
              Apply
            </button>
          </form>
        </div>


        <DataTable value={products} selectionMode="multiple" selection={selectedProducts} onSelectionChange={(e: any) => {
          setSelectedProducts(e.value);
          console.log(e.value);

        }} dataKey="id" loading={loading} className="p-datatable-sm" rowHover stripedRows>
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="title" header="TITLE" style={{ fontWeight: '500' }}></Column>
          <Column field="place_of_origin" header="PLACE OF ORIGIN"></Column>
          <Column field="artist_title" header="ARTIST" body={(rowData) => rowData.artist_title}></Column>
          <Column field="inscriptions" header="INSCRIPTONS" body={(rowData) => rowData.inscriptions || 'N/A'}></Column>
          <Column field="date_start" header="START YEAR" body={(rowData) => `${rowData.date_start}`}></Column>
          <Column field="date_end" header="END YEAR" body={(rowData) => `${rowData.date_end}`}></Column>
        </DataTable>

        <div className="bg-gray-50 border-t border-gray-100 py-2">
          <Paginator first={first} rows={rows} totalRecords={totalRecords} onPageChange={onPageChange} template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          />
        </div>
      </div>
    </div>
  );
}

export default App;