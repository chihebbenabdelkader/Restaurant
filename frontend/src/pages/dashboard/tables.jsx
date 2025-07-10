

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "../../../utils/baseUrl"; // Assurez-vous que le chemin est correct
import { PlusIcon, PencilIcon, TrashIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Checkbox,
  Select,
  Option,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import QRCode from 'react-qr-code';
import { useNavigate } from "react-router-dom";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";

export function Tables() {
  const token = Cookies.get("token");
  const [tables, setTables] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(""); // Ou un nom plus parlant
  // ... (vos états existants)
  const [openQrCodeDialog, setOpenQrCodeDialog] = useState(false);
  const [qrCodeDataForDisplay, setQrCodeDataForDisplay] = useState({ url: '', number: '' }); // Pour stocker l'URL et le numéro de table
  const navigate = useNavigate();
  const fetchTables = async () => {
    try {
      // Adaptez l'URL selon votre route backend (ex: /table ou /table/byAdmin)
      // Si restaurantId est nécessaire, ajoutez-le aux paramètres de la requête
      const res = await axios.get(`${baseUrl}/table`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,  // add this line to send cookies

      });
      setTables(res.data);
    } catch (err) {
      console.error("Fetch tables failed:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [token]); // Dépendance au token

  const openAddDialog = () => {
    setEditingTable(null);
    setQuantityToAdd("");
    setOpenDialog(true);
  };

  const openEditDialog = (table) => {
    setEditingTable(table);
    setQuantityToAdd("");
    setOpenDialog(true);
  };
  //   const confirmDelete = async () => {
  //   try {
  //     await axios.delete(`${baseUrl}/table/${tableToDelete}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setOpenDeleteDialog(false); // Fermer le dialogue
  //     setTableToDelete(null); // Réinitialiser l'ID de la table à supprimer
  //     fetchTables(); // Recharger les tables après suppression
  //   } catch (err) {
  //     console.error("Delete table failed:", err);
  //     setOpenDeleteDialog(false);
  //     setTableToDelete(null);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      if (editingTable) {
        await axios.put(
          `${baseUrl}/table/${editingTable._id}`,
          { quantity: quantityToAdd, /* restaurantId: ... */ }, // Envoyez 'quantity'
          {
            headers: { Authorization: `Bearer ${token}` }, withCredentials: true,  // add this line to send cookies
          },

        );
      } else {
        await axios.post(
          `${baseUrl}/addTable`,
          { quantity: quantityToAdd, /* restaurantId: ... */ }, // Envoyez 'quantity'
          {
            headers: { Authorization: `Bearer ${token}` }, withCredentials: true,  // add this line to send cookies
          }
        );
      }
      setOpenDialog(false);
      fetchTables(); // Recharger les tables après modification
    } catch (err) {
      console.error("Save table failed:", err);
    }
  };

  const handleDelete = (id) => { // NOTE: Supprimez le mot-clé 'async' ici
    setTableToDelete(id); // Stocke l'ID de la table à supprimer
    setOpenDeleteDialog(true); // Ouvre la boîte de dialogue de confirmation
  };

  // 3. Ajoutez la nouvelle fonction confirmDelete :
  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/table/${tableToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenDeleteDialog(false); // Ferme le dialogue après la suppression
      setTableToDelete(null); // Réinitialise l'état de la table à supprimer
      fetchTables(); // Recharge la liste des tables
    } catch (err) {
      console.error("Delete table failed:", err);
      // Gérer l'erreur, éventuellement afficher un message à l'utilisateur
      setOpenDeleteDialog(false); // S'assurer que le dialogue se ferme même en cas d'erreur
      setTableToDelete(null);
    }
  };
  return (
    <div className="mt-12 mb-8 space-y-6">

      <div className="flex justify-end mr-6">
        <Button
          onClick={openAddDialog}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" /> Add Table
        </Button>
      </div>
      <br></br>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Mes Tables
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["table", "status", "Consommation", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tables?.map((table, key) => {
                const className = `py-3 px-5 ${key === tables.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;
                return (
                  <tr key={table._id}>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {table.number}
                      </Typography>
                    </td>
                    {/* Ajoutez ici d'autres colonnes si votre modèle de table a plus de champs, ex: status, consommation */}
                    <td className={className}>
                      {/* Afficher le statut de la table si disponible (ex: occupée, libre, en attente de service) */}
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {/* table.status || "Libre" */}
                      </Typography>
                    </td>
                    <td className={className}>
                      {/* Afficher des infos de consommation si disponibles */}
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {/* table.currentOrderTotal || "0 DT" */}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        {/* <Button
              size="sm"
              color="blue"
              variant="outlined"
              onClick={() => openEditDialog(table)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button> */}
                        <Button
                          size="sm"
                          color="red"
                          variant="outlined"
                          onClick={() => handleDelete(table._id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        {/* Bouton pour visualiser/générer le QR Code */}
                        <Button
                          size="sm"
                          color="purple"
                          variant="outlined"
                          onClick={() => {
                            setQrCodeDataForDisplay({ url: table.qrCodeUrl, number: table.number });
                            setOpenQrCodeDialog(true);
                            console.log(table.qrCodeUrl)

                          }}

                        >
                          <QrCodeIcon className="h-4 w-4" />
                        </Button>
                      </div>

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Confirmer la suppression</DialogHeader>
        <DialogBody divider>
          <Typography>Êtes-vous sûr de vouloir supprimer cette table ? Cette action est irréversible.</Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            Annuler
          </Button>
          <Button variant="gradient" color="red" onClick={confirmDelete}>
            Confirmer
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ... après la Card existante ... */}
      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader>{editingTable ? "Modifier la Table" : "Ajouter une Table"}</DialogHeader>
        <DialogBody divider>
          <Input
            label="Quantité de tables à ajouter" // Texte du label mis à jour
            value={quantityToAdd} // Utilisez la nouvelle variable
            onChange={(e) => setQuantityToAdd(e.target.value)} // Mettez à jour le setter
            type="number"
            size="lg"
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {editingTable ? "Modifier" : "Ajouter"}
          </Button>
        </DialogFooter>
      </Dialog>


      <Dialog open={openQrCodeDialog} handler={() => setOpenQrCodeDialog(false)}>
        <DialogHeader>QR Code pour la Table {qrCodeDataForDisplay.number}</DialogHeader>
        <DialogBody divider className="flex justify-center items-center p-4">
          {qrCodeDataForDisplay.url ? (
            <div className="p-4 bg-white rounded-lg shadow-md"> {/* Ajout d'un peu de style pour le QR code */}
              <QRCode
                value={qrCodeDataForDisplay.url}
                size={256} // Taille du QR code en pixels
                level="H" // Niveau de correction d'erreur (L, M, Q, H - H est le plus élevé)
                viewBox={`0 0 256 256`} // Important pour le redimensionnement
              />
            </div>
          ) : (
            <Typography>URL du QR Code non disponible pour cette table.</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="blue-gray" onClick={() => setOpenQrCodeDialog(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </Dialog>


    </div>
  );
}

export default Tables;
