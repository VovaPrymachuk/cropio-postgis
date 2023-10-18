import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IField } from '../types/data';
import axios from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import { DeleteConfirmationDialog } from './UI/DeleteConfirmationDialog';


interface FieldListProps {
  onRecordDeleted: () => void;
}

export const FieldList: React.FC<FieldListProps> = ({ onRecordDeleted }) => {
  const [fields, setFields] = useState<IField[]>([]);
  const [isUpdate, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    getFields();
    setUpdate(false);
  }, [isUpdate]);

  const getFields = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/fields');
      setFields(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id?: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/fields/${id}`);
      setUpdate(true);
      onRecordDeleted();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Area (square kilometers)</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={index}>
              <TableCell>
                <Link to={`/fields/${field.id}`}>{field.name}</Link>
              </TableCell>
              <TableCell>{field.area}</TableCell>
              <TableCell align="right">
                <Stack direction="row-reverse" spacing={2}>
                  <DeleteConfirmationDialog
                    action="index"
                    onDelete={() => handleDelete(field.id)}
                  />
                  <Button
                    variant="outlined"
                    endIcon={<EditIcon />}
                    component={Link}
                    to={`/fields/${field.id}/edit`}
                  >
                    Edit
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
