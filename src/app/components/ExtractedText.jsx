const ExtractedText = ({ text, setText }) => {
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="bg-black p-4 rounded shadow-lg w-full mt-4">
      <h2 className="text-xl font-bold mb-2 text-white">Texto extraído</h2>
      <textarea
        value={text}
        onChange={handleTextChange}
        className="w-full h-64 p-2 border rounded text-gray-700"
        placeholder="Carga un archivo para editar el texto."
      />
    </div>
  );
};

export default ExtractedText;
