import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IField } from '../types/data';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';

import { getFields, handleDeleteField } from '../api';
import { DeleteConfirmationDialog } from './UI/DeleteConfirmationDialog';


interface FieldListProps {
  onRecordDeleted: () => void;
}

export const FieldList: React.FC<FieldListProps> = ({ onRecordDeleted }) => {
  const [fields, setFields] = useState<IField[]>([]);
  const [isUpdate, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    getFieldsResponse();
    setUpdate(false);
  }, [isUpdate]);
  
  const getFieldsResponse = async () => {
    const response = await getFields();
    setFields(response);
  }

  const handleDelete = async (id?: number) => {
    if (id) {
      await handleDeleteField(id);
      setUpdate(true);
      onRecordDeleted();
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
