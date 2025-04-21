import React, { useState } from "react";
import CurrentClientProject from "../../components/Clients/CurrentClientProject";
import PageHeader from "../../components/common/PageHeader";
import ModalEvento from "../../components/ModalEvento";
import { useEventos } from "../../hooks/useEventos";

/**
 * Projects screen repurposed to manage 'eventos' from Firebase.
 * Displays cards with event info and uses ModalEvento for CRUD.
 */
function Projects() {
  const { eventos, guardarEvento } = useEventos();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);

  const handleOpenNew = () => {
    setSelectedEvento(null);
    setShowModal(true);
  };

  const handleOpenEdit = (evt) => {
    setSelectedEvento(evt);
    setShowModal(true);
  };

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Proyectos"
        renderRight={() => (
          <div className="d-flex py-2 project-tab flex-wrap w-sm-100">
            <button
              type="button"
              className="btn btn-dark w-sm-100"
              onClick={handleOpenNew}
            >
              <i className="icofont-plus-circle me-2 fs-6"></i>Crear evento
            </button>
          </div>
        )}
      />
      <div className="row g-3 gy-5 py-3 row-deck">
        {eventos.map((evt) => {
          const logo =
            evt.tipo === "Instalacion"
              ? "icofont-under-construction"
              : evt.tipo === "Garantia"
              ? "icofont-bandage"
              : "icofont-ui-calendar";
          const logoBg =
            evt.tipo === "Instalacion"
              ? "light-warning-bg"
              : evt.tipo === "Garantia"
              ? "light-danger-bg"
              : "light-info-bg";

          return (
            <div
              key={evt.id}
              className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6"
            >
              <CurrentClientProject
                teamImage={evt.teamImage || []}
                logo={logo}
                logoBg={logoBg}
                title={evt.nombre}
                sl={evt.tipo}
                inicio={evt.inicio}
                final={evt.final}
                onClickEdit={() => handleOpenEdit(evt)}
                onClickDelete={() => handleOpenEdit(evt)}
                onClickAdd={() => {}}
              />
            </div>
          );
        })}
      </div>
      <ModalEvento
        visible={showModal}
        onClose={() => setShowModal(false)}
        onGuardarEvento={guardarEvento}
        evento={selectedEvento}
        eventos={eventos}
      />
    </div>
  );
}

export default Projects;