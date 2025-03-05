import React, { useEffect, useState,useRef} from 'react';
import moment from 'moment';
import Sortable from 'sortablejs';
import { DATASET, IMP } from '../services/core.js'; // Asegúrate de que esta importación funcione correctamente

const BannersManagement = () => {
  // const [dataBanners, setDataBanners] = useState([]);
  // const [bannersObj, setBannersObj] = useState({});
  // const [grupo, setGrupo] = useState("superior");
  // const [estado, setEstado] = useState(1);
  // const [selectedBanner, setSelectedBanner] = useState(null);
  // const formRef = useRef(null); // Referencia para el formulario

  // const ds_banners = new DATASET({
  //   api_model: "banners",
  //   scheme: {
  //     id: null,
  //     estado: 1,
  //     data: null,
  //     imagen: null,
  //     imagen2: null,
  //     imagen3: null,
  //     position: "ninguna",
  //     titulo: null,
  //     titulopublico: null,
  //     fecha_inicio: null,
  //     fecha_fin: null,
  //     grupo: null,
  //   },
  //   sort: { id: "DESC" },
  // });

  // useEffect(() => {
  //   const init = async () => {
  //     await loadBanners();
  //   };
  //   init();
  // }, [grupo, estado]);

  // useEffect(() => {
  //   if (dataBanners.length > 0) {
  //     const tbody = document.querySelector("#lista1 tbody");
  //     new Sortable(tbody, {
  //       placeholder: true,
  //       group: "shared",
  //       animation: 50,
  //       ghostClass: "blue-background-class",
  //     });
  //   }
  // }, [dataBanners]);

  // // Cargar banners
  // const loadBanners = async () => {
  //   const bannersData = await ds_banners.get({filter: { grupo, estado },paging: { limit: 100 },});
   
  //   const bannersArray = bannersData.default;
  //   const bannersObj = {};

  //   IMP.forEach(bannersArray, (item) => {
  //     item.status = moment().isAfter(item.fecha_fin)
  //       ? "vencido"
  //       : moment().isBefore(item.fecha_inicio)
  //       ? "programado"
  //       : "visible";
  //     bannersObj[item.id] = { item, position: noErrorParse(item.position) };
  //   });

  //   setDataBanners(bannersArray);
  //   setBannersObj(bannersObj);
  // };

  // const handleRowClick = (banner) => {
  //   setSelectedBanner(banner); // Cargar los datos del banner seleccionado en el estado
  //   populateForm(banner); // Poner los datos del banner en el formulario
  // };

  // const populateForm = (banner) => {
  //   if (formRef.current) {
  //     const form = formRef.current;
  //     form["id"].value = banner.id;
  //     form["estado"].value = banner.estado;
  //     form["grupo"].value = banner.grupo;
  //     form["titulo"].value = banner.titulo;
  //     form["titulopublico"].value = banner.titulopublico;
  //     form["imagen"].value = banner.imagen;
  //     form["imagen2"].value = banner.imagen2;
  //     form["imagen3"].value = banner.imagen3;
  //     form["fecha_inicio"].value = formatDate("compact", banner.fecha_inicio);
  //     form["fecha_fin"].value = formatDate("compact", banner.fecha_fin);
  //     form["data"].value = banner.data;
  //   }
  // };

  // const handleSave = async () => {
  //   const formData = new FormData(formRef.current); // Obtener datos del formulario
  //   const fields = Object.fromEntries(formData.entries()); // Convertir a objeto
  //   const sendData = {
  //     fields,
  //     filter: selectedBanner ? { id: selectedBanner.id } : {},
  //   };

  //   await ds_banners.set({ [selectedBanner ? selectedBanner.id : "new"]: sendData });
  //   loadBanners(); // Recargar los banners después de guardar
  // };

  // // Renderizar banners
  // const renderBanners = () => {
  //   return dataBanners.map((item) => (
  //     <tr key={item.id} data-id={item.id} onClick={() => handleRowClick(item)}>
  //       <td style={{ width: grupo === "destacados" ? "100px" : "300px" }}>
  //         <img src={item.imagen} style={{ width: "100%" }} alt={item.titulo} />
  //       </td>
  //       <td>
  //         <b>{item.titulo}</b>
  //         <br />
  //         <span className="fecha2">
  //           {formatDate("short", item.fecha_inicio)} - {formatDate("short", item.fecha_fin)}
  //         </span>
  //         <br />
  //         <span className={`status-${item.status}`}>{item.status}</span>
  //       </td>
  //     </tr>
  //   ));
  // };

  // const formatDate = (type, date) => {
  //   switch (type) {
  //     case "short":
  //       return moment(date).format("MMM DD YYYY");
  //     case "compact":
  //       return moment(date).format("YYYY-MM-DD");
  //     default:
  //       return date;
  //   }
  // };

  // return (
  //   <div>
  //     <h2>Gestión de Banners</h2>

  //     {/* Selectores de Grupo y Estado */}
  //     <div>
  //       <label>Grupo:</label>
  //       <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
  //         <option value="superior">hola</option>
  //         <option value="inferior">Inferior</option>
  //         <option value="destacados">Destacados</option>
  //         <option value="categorias">Categorias</option>
  //         <option value="busqueda">Búsqueda</option>
  //       </select>

  //       <label>Estado:</label>
  //       <select value={estado} onChange={(e) => setEstado(e.target.value)}>
  //         <option value={1}>Activo</option>
  //         <option value={0}>Inactivo</option>
  //       </select>
  //     </div>

  //     {/* Lista de banners */}
  //     <div className="layer">
  //       <table id="lista1" className="fl-table main-list">
  //         <thead>
  //           <tr>
  //             <th>Imagen</th>
  //             <th>Título</th>
  //           </tr>
  //         </thead>
  //         <tbody>{renderBanners()}</tbody>
  //       </table>
  //     </div>

  //     {/* Botones de acción */}
  //     <div className="tool-row center">
  //       <button onClick={() => handleSave()}>Guardar</button>
  //       <button onClick={() => setSelectedBanner(null)}>Nuevo</button>
  //     </div>

  //     {/* Formulario */}
  //     <div className="layer">
  //       <form className="main-form" ref={formRef}>
  //         <div className="form-row" data-label="ID">
  //           <input type="text" name="id" readOnly />
  //         </div>
  //         <div className="form-row" data-label="Estado">
  //           <select name="estado">
  //             <option value="0">Inactivo</option>
  //             <option value="1">Activo</option>
  //           </select>
  //         </div>
  //         <div className="form-row" data-label="Grupo">
  //           <select name="grupo">
  //             <option value="superior">Superior</option>
  //             <option value="inferior">Inferior</option>
  //             <option value="destacados">Destacados</option>
  //           </select>
  //         </div>
  //         <div className="form-row" data-label="Título">
  //           <input type="text" name="titulo" />
  //         </div>
  //         <div className="form-row" data-label="Título Público">
  //           <input type="text" name="titulopublico" />
  //         </div>
  //         <div className="form-row" data-label="Imagen Web">
  //           <input type="text" name="imagen" />
  //         </div>
  //         <div className="form-row" data-label="Imagen Mobile">
  //           <input type="text" name="imagen2" />
  //         </div>
  //         <div className="form-row" data-label="Imagen Popup">
  //           <input type="text" name="imagen3" />
  //         </div>
  //         <div className="form-row" data-label="Fecha">
  //           <input type="date" name="fecha_inicio" />
  //           <input type="date" name="fecha_fin" />
  //         </div>
  //         <div className="form-row" data-label="Data">
  //           <textarea name="data"></textarea>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
};

export default BannersManagement;

// Función para manejar los errores al analizar los datos de posición
const noErrorParse = (data) => {
  if (!data || data === "") return {};
  let parsedData = {};
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    parsedData = {};
  }
  return parsedData;
};
