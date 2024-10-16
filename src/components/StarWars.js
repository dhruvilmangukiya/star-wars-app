import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { format } from "date-fns";
import Loader from "./Loader";
import { useLoading } from "../context/LoadingContext";
import { getStarWarsPeople } from "../services/wars.service";

Modal.setAppElement("#root");

const StarWars = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFirstPage = page === 1;

  // get people list on load
  useEffect(() => {
    getPeopleList(page);
  }, [page]);

  // get people list
  const getPeopleList = async (page) => {
    startLoading();
    const response = await getStarWarsPeople(page);
    setCharacters(response);
    stopLoading();
  };

  // open and close modal
  const openCloseModal = (character, isOpenModal) => {
    setModalData(character);
    setIsModalOpen(isOpenModal);
  };

  // render common next and prev buttons
  const renderNextPrevButtons = (name) => {
    const isNextPage = name === "Next";
    const isDisable =
      (isFirstPage && !isNextPage) || (characters?.length !== 10 && isNextPage);

    return (
      <button
        disabled={isDisable}
        onClick={() => setPage(!isNextPage ? page - 1 : page + 1)}
        className={`rounded-lg focus:ring-2 px-[20px] py-[10px] ${
          isDisable ? "bg-gray-100 text-gray-600" : "bg-indigo-500 text-white"
        }`}
      >
        {name}
      </button>
    );
  };

  // render character details
  const renderCharacterDetails = (character) => {
    if (!character) return null;
    const dateAdded = format(new Date(character.created), "dd-MM-yyyy");
    const characterDetails = [
      { label: "Height", value: character.height / 100 },
      { label: "Mass", value: `${character.mass} kg` },
      { label: "Birth Year", value: character.birth_year },
      { label: "Date Added", value: dateAdded },
      { label: "Appears in", value: character.films.length },
    ];

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 px-5 py-3">
          {character.name}
        </h2>
        <div class="grid grid-cols-2 gap-2 px-5">
          {characterDetails.map((detail) => (
            <p>
              <strong>{detail.label}</strong>
              <p>{detail.value}</p>
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="px-5 py-20 text-center h-screen flex flex-col justify-between max-w-[1000px]">
        <h1 className="text-2xl font-bold">Star Wars Characters</h1>

        {loading && <Loader />}

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 my-6">
          {characters.map((character) => (
            <>
              <div
                className="transition-transform duration-300 transform hover:scale-110 flex justify-center items-center h-[100px] rounded-[8px] cursor-pointer bg-[#f0f0f0] hover:bg-[#d0d0d0] p-5"
                key={character.name}
                onClick={() => openCloseModal(character, true)}
              >
                <h3 className="font-medium">{character.name}</h3>
              </div>
            </>
          ))}
        </div>

        <div className="pagination flex items-center justify-center gap-5">
          {renderNextPrevButtons("Previous")}
          <p className="bg-cyan-400 w-8 h-8 rounded-full flex justify-center items-center text-white">
            {page}
          </p>
          {renderNextPrevButtons("Next")}
        </div>

        <Modal
          style={{
            content: {
              width: "80%",
              maxWidth: "400px",
            },
          }}
          isOpen={isModalOpen}
          onRequestClose={() => openCloseModal(null, false)}
          contentLabel="Character Details"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg outline-none"
          overlayClassName="modal-overlay"
        >
          {renderCharacterDetails(modalData)}
          <div className="flex justify-end p-5">
            <button
              className="rounded-lg focus:ring-2 bg-gray-600 text-white h-10 w-20 flex items-center justify-center"
              onClick={() => openCloseModal(null, false)}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default StarWars;
