"use client";
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

export interface FoodOption {
  id: string;
  name: string;
  price: number;
}

export interface FoodCategory {
  id: string;
  name: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: FoodOption[];
}

export interface CustomizableFoodItem {
  id: string;
  name: string;
  description: string;
  category: 'pack-lunch' | 'food-set';
  categories: FoodCategory[];
  image?: string;
}

export interface CustomizedSelection {
  [categoryId: string]: string[]; // For single: array with one item, for multiple: array with multiple items
}

interface FoodCustomizationModalProps {
  open: boolean;
  onClose: () => void;
  item: CustomizableFoodItem;
  onAddToCart: (item: CustomizableFoodItem, selections: CustomizedSelection, totalPrice: number) => void;
}

export default function FoodCustomizationModal({
  open,
  onClose,
  item,
  onAddToCart,
}: FoodCustomizationModalProps) {
  const [selections, setSelections] = useState<CustomizedSelection>({});

  const handleSingleSelection = (categoryId: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: [optionId],
    }));
  };

  const handleMultipleSelection = (categoryId: string, optionId: string, checked: boolean) => {
    setSelections((prev) => {
      const current = prev[categoryId] || [];
      if (checked) {
        return {
          ...prev,
          [categoryId]: [...current, optionId],
        };
      } else {
        return {
          ...prev,
          [categoryId]: current.filter((id) => id !== optionId),
        };
      }
    });
  };

  const calculateTotalPrice = (): number => {
    let total = 0;
    item.categories.forEach((category) => {
      const selectedOptions = selections[category.id] || [];
      selectedOptions.forEach((optionId) => {
        const option = category.options.find((opt) => opt.id === optionId);
        if (option) {
          total += option.price;
        }
      });
    });
    return total;
  };

  const isSelectionValid = (): boolean => {
    return item.categories.every((category) => {
      if (category.required) {
        const selected = selections[category.id] || [];
        return selected.length > 0;
      }
      return true;
    });
  };

  const handleAddToCart = () => {
    if (isSelectionValid()) {
      onAddToCart(item, selections, calculateTotalPrice());
      setSelections({});
      onClose();
    }
  };

  const getSelectedOptionName = (categoryId: string): string => {
    const selected = selections[categoryId] || [];
    if (selected.length === 0) return '';
    const category = item.categories.find((cat) => cat.id === categoryId);
    if (!category) return '';
    const option = category.options.find((opt) => opt.id === selected[0]);
    return option?.name || '';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Customize {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {item.categories.map((category) => (
            <Box key={category.id}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {category.name}
                  {category.required && (
                    <Chip
                      label="Required"
                      size="small"
                      color="error"
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </FormLabel>
                {category.type === 'single' ? (
                  <RadioGroup
                    value={selections[category.id]?.[0] || ''}
                    onChange={(e) => handleSingleSelection(category.id, e.target.value)}
                  >
                    {category.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', ml: 1 }}>
                            <Typography>{option.name}</Typography>
                            <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                              +${option.price.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 1,
                          px: 2,
                          py: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <FormGroup>
                    {category.options.map((option) => {
                      const isSelected = (selections[category.id] || []).includes(option.id);
                      return (
                        <FormControlLabel
                          key={option.id}
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) =>
                                handleMultipleSelection(category.id, option.id, e.target.checked)
                              }
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', ml: 1 }}>
                              <Typography>{option.name}</Typography>
                              <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                                +${option.price.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            border: '1px solid',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            borderRadius: 2,
                            mb: 1,
                            px: 2,
                            py: 1,
                            backgroundColor: isSelected ? 'action.selected' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                )}
              </FormControl>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box>
            <Typography variant="h6" color="text.secondary">
              Total Price:
            </Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              ${calculateTotalPrice().toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="contained"
              disabled={!isSelectionValid()}
              size="large"
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

