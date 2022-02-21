import React from "react";
import Arrow from "../subcomponents/Arrow";
import { Grid, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { Editor, Node as SlateNode } from "slate";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import ToggleButtonList from "../subcomponents/ToggleButtonList";
import CopyToClipboard from "../subcomponents/CopyToClipboard";
import { serialize } from "hooks/currentSelectEditor";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";

const TotalCharacters = styled("div")(({ theme }) => ({
  padding: "0.1em 0.1rem",
  color: theme.palette.primary.main,
  fontSize: "80%",
  maxHeight: "24px",
  fontWeight: 600,
  textAlign: "center",
  borderRadius: "10%",
}));

const TotalCharactersWarning = styled("div")(({ theme }) => ({
  padding: "0.1em 0.1rem",
  color: theme.palette.warning.main,
  fontSize: "80%",
  maxHeight: "24px",
  fontWeight: 600,
  textAlign: "center",
  borderRadius: "10%",
}));

interface footerEditorBarProps {
  editor: Editor;
  handleTranser?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const FooterEditorBar = ({
  editor,
  handleTranser,
  disabled = false,
}: footerEditorBarProps) => {
  const CharCount =
    serialize(editor).length > 1000 ? TotalCharactersWarning : TotalCharacters;
  const warningMessage =
    serialize(editor).length > 1000
      ? "Please enter a maximum of 200 words."
      : "";

  return (
    <>
      <Divider
        orientation='horizontal'
        component='hr'
        variant='fullWidth'
        sx={{
          width: "100%",
          marginTop: "1.5rem",
        }}
      />
      <Grid item xs={11} container direction='row' alignItems='flex-end'>
        {disabled ? "" : <Arrow onClick={handleTranser} />}
        <CopyToClipboard editor={editor} />
        <ToggleButtonList
          title='BookmarkBorderRoundedIcon'
          icon={<BookmarkBorderRoundedIcon fontSize='inherit' />}
          disabled={true}
        />
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          maxHeight: "20px",
        }}
        xs={1}
      >
        <ToggleButtonList
          title='Undo'
          icon={<UndoIcon fontSize='inherit' />}
          onClick={(event) => {
            // event.preventDefault();
            editor.undo();
          }}
          disabled={editor.history.undos.length == 0}
        />
        <ToggleButtonList
          title='Redo'
          icon={<RedoIcon fontSize='inherit' />}
          onClick={(event) => {
            event.preventDefault();
            editor.redo();
          }}
          disabled={editor.history.redos.length == 0}
        />
        <ToggleButtonList
          title='Number of Characters'
          icon={
            <Typography
              sx={{
                mb: 0,
              }}
              variant='caption'
              display='block'
              gutterBottom
            >
              <CharCount>{serialize(editor).length}</CharCount>
            </Typography>
          }
        />
      </Grid>
    </>
  );
};

export default FooterEditorBar;
