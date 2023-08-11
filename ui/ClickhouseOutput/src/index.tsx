import React, { useContext, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { AyxAppWrapper, Box, Grid, Typography, makeStyles, Theme } from '@alteryx/ui';
import { Alteryx } from '@alteryx/icons';
import { Context as UiSdkContext, DesignerApi } from '@alteryx/react-comms';
import { AyxAppWrapper, Grid, makeStyles, Theme, Autocomplete, TextField } from '@alteryx/ui';


const useStyles = makeStyles({
  autoSize: {
    width: 300
  }
});

const App = () => {
  const classes = useStyles();
  const [model, handleUpdateModel] = useContext(UiSdkContext);


  // Dev Harness Specific Code ---------- Start
  // The following code is specifically a dev harness functionality.
  // If you're developing a tool for Designer, you'll want to remove this
  // and check out our docs for guidance 
  if (Array.isArray(model.Meta)) {
    return null;
  }
  console.log(model)
  let fields = model?.Meta?.fields[0][0]?.fields?.map(field => field.name);
  if (!fields) 
    fields = []
  // Dev Harness Specific Code ---------- End

  const onChangeField = text => {
    const newModel = { ...model }
    newModel.Configuration.field = text;
    handleUpdateModel(newModel);
  }
  
  const onChangeText = name => event => {
    const newModel = { ...model }
    newModel.Configuration.filterText = event.target.value;
    handleUpdateModel(newModel);
  }

  return (
    <Grid container justify="center" spacing={4}>
      <Grid item>
        <Autocomplete
          value={model.Configuration.field}
          className={classes.autoSize}
          getOptionLabel={option => option}
          options={fields}
          renderInput={params => <TextField {...params} fullWidth label="Filter" />}
          onChange={(_, newValue) => {onChangeField(newValue)}}
         />
      </Grid>
      <Grid item>
         <TextField
           className={classes.autoSize}
           fullWidth
           helperText="filter text"
           inputLabelProps={{
            shrink: true
           }}
           label="Filter Text"
           style={{margin: 8}}
           onChange={onChangeText('name')}
           value={model.Configuration.filterText}
         />
      </Grid>
    </Grid>
  );
}

const Tool = () => {
  return (
    <DesignerApi messages={{}} defaultConfig={{ Configuration: { field: '', filterText: '' } }}>
      <AyxAppWrapper> 
        <App />
      </AyxAppWrapper>
    </DesignerApi>
  )
}

ReactDOM.render(
  <Tool />,
  document.getElementById('app')
);
