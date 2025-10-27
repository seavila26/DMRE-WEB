// VisitList.jsx
export default function VisitList({ visitas }) {
  if (!visitas || visitas.length === 0) {
    return <p className="text-gray-500">No hay visitas registradas.</p>;
  }

  return (
    <ul className="mb-6 space-y-4">
      {visitas.map((v) => (
        <li key={v.id} className="p-4 bg-white rounded shadow">
          <p><strong>📅 Fecha:</strong> {new Date(v.fecha).toLocaleString()}</p>
          <p><strong>📝 Diagnóstico:</strong> {v.diagnostico}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-bold text-blue-600 mb-2">Ojo Derecho</h3>
              {v.imagenes?.derecho?.length ? (
                <div className="flex gap-2 flex-wrap">
                  {v.imagenes.derecho.map((img) => (
                    <img key={img.id} src={img.url} alt={img.id} className="w-24 h-24 object-cover rounded border" />
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">Sin imágenes</p>}
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Ojo Izquierdo</h3>
              {v.imagenes?.izquierdo?.length ? (
                <div className="flex gap-2 flex-wrap">
                  {v.imagenes.izquierdo.map((img) => (
                    <img key={img.id} src={img.url} alt={img.id} className="w-24 h-24 object-cover rounded border" />
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">Sin imágenes</p>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
