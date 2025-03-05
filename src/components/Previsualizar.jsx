import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Chip, Typography, Button } from "@mui/material";
import { useState ,useEffect } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';
import Laptop from "../assets/Icon-Laptop.svg";
import Mobile from "../assets/Icon-DeviceMobile.svg";
import DeskSuperior from "../assets/Bannersuperior.svg";
import DeskInferior from "../assets/Bannerinferior.svg";
import DeskPrevPopup from "../assets/Popup.svg";
import MobSuperior from "../assets/Bannersupmob.svg";
import MobInferior from "../assets/Bannerinfmob.svg";
import MobPrevPopup from "../assets/Popupmob.svg";




const Previsualizar = ({ image1,image2,image3,state,stateFormat,dispatchformat,selectedBanner,setSelectedBanner}) => {

  

  useEffect(() => {
    // Determina qué banners están disponibles en base al estado actual
    const availableBanners = [];
    if (state.selectedBPIndex.includes(0)) availableBanners.push('superior');
    if (state.selectedBPIndex.includes(1)) availableBanners.push('inferior');
    if (state.selectedPopIndex.length > 0) availableBanners.push('popup');
  
    // Si no hay un banner seleccionado o el banner seleccionado no está disponible, selecciona el último agregado
    if (!availableBanners.includes(selectedBanner)) {
      setSelectedBanner(availableBanners[availableBanners.length - 1] || null);
    } 
  }, [state.selectedBPIndex, state.selectedPopIndex, selectedBanner]);
  


  return (
    <>


        <Box sx={{ width: "100%" }}>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button
          
            sx={{ display: "flex", p: "8px 16px" ,borderRadius: "100px 0px 0px 100px",  justifyContent:"center",alignItems:"center",
              border:" 1px solid var(--gray-500667085, #667085)",
              background:  stateFormat.Escritorio && !stateFormat.Mobile  ? "var(--gray-100-f-2-f-4-f-7, #F2F4F7)":"#FFFFFF",
  
            }}
              onClick={() => {
                dispatchformat({ type: "Escritorio" });
              }}
          > <Box component="img" src={Laptop} alt="Laptop" sx={{ marginRight: '6px' }} />
           <Typography 
            fontSize="12px"
            fontWeight="500"
            lineHeight="16px"
            color= "var(--gray-700101828, #101828)">
            Escritorio
            </Typography>
          </Button>

          <Button
            
            sx={{ display: "flex", p: "8px 16px" ,borderRadius: "0px 100px 100px 0px",justifyContent:"center",alignItems:"center",
              border:" 1px solid var(--gray-500667085, #667085)",
              background:  stateFormat.Mobile && !stateFormat.Escritorio ? "var(--gray-100-f-2-f-4-f-7, #F2F4F7)":"#FFFFFF",}}
              onClick={() => {
                dispatchformat({ type:"Mobile" });
              }}
          > <Box component="img" src={Mobile} alt="Laptop" sx={{ marginRight: '6px' }} />
           <Typography
            fontSize="12px"
            fontWeight="500"
            lineHeight="16px"
            color= "var(--gray-700101828, #101828)">
            Mobile
            </Typography>
          </Button>
        </ButtonGroup>

        <Stack direction="row" spacing={1} sx={{mb:"16px"}}>
          {state.selectedBPIndex.includes(0) && (
                     <Chip
                   
                     label={"Banner principal superior"}
                     variant={ selectedBanner === 'superior'  ? 'filled': 'outlined' }
                     onClick={() => setSelectedBanner('superior')}
                     sx={{
                      backgroundColor: selectedBanner === 'superior'  ? '#667085' : '#F2F4F7',
                      color: selectedBanner === 'superior' ?'#FCFCFD' : '#667085',
                      '&:hover': {
                          backgroundColor: selectedBanner === 'superior' ? '#667085' : '#ECF4FC',
                          color: selectedBanner === 'superior' ? '#101828' : '#101828',
                      },
                  }}
                
      
                   />
          )}

          {state.selectedBPIndex.includes(1) && (
                    <Chip
             
                    label={"Banner principal inferior"}
                    variant={selectedBanner === 'inferior' ? 'filled' : 'outlined'}
                    onClick={() => setSelectedBanner('inferior')}
                    sx={{
                      backgroundColor: selectedBanner === 'inferior'  ? '#667085' : '#F2F4F7',
                      color: selectedBanner === 'inferior' ?'#FCFCFD' : '#667085',
                      '&:hover': {
                          backgroundColor: selectedBanner === 'inferior' ? '#667085' : '#ECF4FC',
                          color: selectedBanner === 'inferior' ? '#101828' : '#101828',
                      },
                  }}
 
                  />
          )}

            {state.selectedPopIndex.length !== 0 && (
              <Chip

                label={"Pop-up"}
                variant={selectedBanner === 'popup' ? 'filled' : 'outlined'}
                onClick={() => setSelectedBanner('popup')}
                sx={{
                  backgroundColor: selectedBanner === 'popup'  ? '#667085' : '#F2F4F7',
                  color: selectedBanner === 'popup' ?'#FCFCFD' : '#667085',
                  '&:hover': {
                      backgroundColor: selectedBanner === 'popup' ? '#667085' : '#ECF4FC',
                      color: selectedBanner === 'popup' ? '#101828' : '#101828',
                  },
              }}
              />
            )}
         </Stack>

           
          {(selectedBanner === 'superior' && stateFormat.Escritorio) && (
            <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>

              <Box
                component="img"
                src={DeskSuperior}
                alt="Banner Superior"
                sx={{ width: '100%', zIndex: 5 }}
              />

              {image1 ? (
                <Box
                  component="img"
                  src={image1.preview}
                  alt="banner superior"
                  sx={{
                    width: '90%',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    transform: 'translate(-5%, 72%)', // Centro absoluto
                    zIndex: 10,
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
          )}

          {(selectedBanner === 'inferior' && stateFormat.Escritorio) && (
            <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>

              <Box
                component="img"
                src={DeskInferior}
                alt="banner inferior  "
                sx={{ width: '100%', zIndex: 5 }}
              />

              {image1 ? (
                <Box
                  component="img"
                  src={image1.preview}
                  alt="banner inferior"
                  sx={{
                    width: '75%',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    transform: 'translate(-17%, 100%)', 
                    zIndex: 10,
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
          )}

          {(selectedBanner === 'popup' && stateFormat.Escritorio) && (
            <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>

              <Box
                component="img"
                src={DeskPrevPopup}
                alt="Popup"
                sx={{ width: '100%', zIndex: 5 }}
              />

              {image3 ? (
                <Box
                  component="img"
                  src={image3.preview}
                  alt="Popup"
                  sx={{
                    width: '31%',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    transform: 'translate(-110%, 28%)',
                    zIndex: 10,
                    borderRadius: "8px"
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
          )}



          
          {(selectedBanner === 'superior' && stateFormat.Mobile) && (
                      <Box sx={{ position: 'relative', width: '50%', height: 'auto' }}>

                        <Box
                          component="img"
                          src={MobSuperior}
                          alt="Popup"
                          sx={{ width: '100%', zIndex: 5 }}
                        />

                        {image2 ? (
                          <Box
                            component="img"
                            src={image2.preview}
                            alt="Popup"
                            sx={{
                              width: '83.5%',
                              position: 'absolute',
                              top: '0',
                              right: '0',
                              transform: 'translate(-10%, 137%)',
                              zIndex: 10,
                              borderRadius: "8px"
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </Box>
                    )}


{(selectedBanner === 'inferior' && stateFormat.Mobile) && (
                      <Box sx={{ position: 'relative', width: '50%', height: 'auto' }}>

                        <Box
                          component="img"
                          src={MobInferior}
                          alt="Popup"
                          sx={{ width: '100%', zIndex: 5 }}
                        />

                        {image2 ? (
                          <Box
                            component="img"
                            src={image2.preview}
                            alt="Popup"
                            sx={{
                              width: '84%',
                              position: 'absolute',
                              top: '0',
                              right: '0',
                              transform: 'translate(-9%, 107%)',
                              zIndex: 10,
                              borderRadius: "8px"
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </Box>
                    )}


{(selectedBanner === 'popup' && stateFormat.Mobile) && (
                      <Box sx={{ position: 'relative', width: '50%', height: 'auto' }}>

                        <Box
                          component="img"
                          src={MobPrevPopup}
                          alt="Popup"
                          sx={{ width: '100%', zIndex: 5 }}
                        />

                        {image3 ? (
                          <Box
                            component="img"
                            src={image3.preview}
                            alt="Popup"
                            sx={{
                              width: '64%',
                              position: 'absolute',
                              top: '0',
                              right: '0',
                              transform: 'translate(-27.5%, 42%)',
                              zIndex: 10,
                              borderRadius: "8px"
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </Box>
                    )}

  


         

      </Box>

      </Box>

    </>
  );
};

export {Previsualizar };
