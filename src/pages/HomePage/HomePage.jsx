import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardComponent from "../../components/CardComponent";
import LoginContext from "../../store/loginContext";
import { toast } from "react-toastify";
import searchContext from "../../store/searchContext";
import ROUTES from "../../routes/ROUTES";
import normalizeCard from "./normalizeCard";
import toastPopup from "../../services/toastPopup";

const HomePage = () => {
  const [dataFromServer, setDataFromServer] = useState([]);
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);
  const { search } = useContext(searchContext);

  useEffect(() => {
    axios
      .get("/cards")
      .then(({ data }) => {
        let normalizedData = normalizeCard(data);
        if (search) {
          normalizedData = normalizedData.filter((card) =>
            card.title.toLowerCase().includes(search.toLowerCase())
          );
        }
        setDataFromServer(normalizedData);
      })
      .catch((err) => {});
  }, [search]);

  if (!dataFromServer || !dataFromServer.length) {
    return <Typography className="text-center">Could not find any items...</Typography>;
  }

  let filteredData = normalizeCard(dataFromServer, login ? login._id : undefined);
  if (!filteredData || !filteredData.length) {
    return <Typography className="text-center">Could not find any items</Typography>;
  }

  const handleCard = (id) => {
    navigate(`${ROUTES.LANDINGPAGE}/${id}`);
  };

  const handleDeleteCard = async (id) => {
    try {
      if (login) {
        await axios.delete(`/cards/${id}`);
        setDataFromServer((currentData) =>
          currentData.filter((card) => card._id !== id)
        );
        toast.success("Card deleted successfully", toastPopup.success);
      } else {
        toast.error("Please login", toastPopup.error);
      }
    } catch (error) {
      toast.error("You are not the owner of this card", toastPopup.error);
    }
  };

  const handleEditCard = async (id) => {
    try {
      if (login) {
        const { data } = await axios.get(`/cards/${id}`);
        if (data.user_id === login._id) {
          navigate(`${ROUTES.EDITCARD}/${id}`);
        } else {
          toast.error("You are not the owner of this card", toastPopup.error);
        }
      } else {
        toast.error("Please login", toastPopup.error);
      }
    } catch (error) {}
  };

  const handleLikeCard = async (id) => {
    try {
      if (login) {
        const { data } = await axios.patch(`/cards/${id}`);
        setDataFromServer((currentData) =>
          currentData.map((card) => (card._id === id ? data : card))
        );
      } else {
        toast.error("Please login", toastPopup.error);
      }
    } catch (error) {}
  };

  return (
    <Box className="p-4">
      <Typography className="text-3xl mb-6 text-center" variant="h3">
        ALL CARDS
      </Typography>
      <Typography className="text-lg mb-6 text-center" variant="h6">
        Here you can find all business cards 
      </Typography>
      <Grid container spacing={4}>
        {filteredData.map((item, index) => (
          <Grid item lg={3} md={6} sm={12} key={`Card-${index}`}>
            <CardComponent
              id={item._id}
              title={item.title}
              subtitle={item.subtitle}
              img={item.image.url}
              alt={item.image.alt}
              phone={item.phone}
              address={item.address}
              cardNumber={item.bizNumber}
              liked={item.liked}
              onCard={handleCard}
              onDelete={handleDeleteCard}
              onEdit={handleEditCard}
              onLike={handleLikeCard}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
