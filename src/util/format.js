export const getDescriptionData = row =>
  row.name
    ? `${row.name} - ${row.vicinity}`
    : row.description.replace('Avenida', 'Av.');

export const getAddressData = data => ({
  address: `${data.name ||
    data.terms[0].value
      .replace('Avenida', 'Av.')
      .replace(',', '')} - ${data.vicinity || data.terms[1].value}`,
  area: data.rating || data.terms[2].value,
});

export const getCoordinatesData = details => ({
  latitude: details.geometry.location.lat,
  longitude: details.geometry.location.lng,
});

export const arrayFormatter = (data, route) =>
  route === 'start' ? data.pop() : data.shift();

export const filterObject = (object, ...keys) => {
  return keys.reduce((result, key) => ({ ...result, [key]: object[key] }), {});
};

export const copyArray = data => {
  const newCopy = [...data];

  return newCopy;
};

export const overiedFirstInput = (data, item) => {
  if (data.length === 1) {
    return [item];
  }

  const clone = copyArray(data);
  const newArray = clone.pop();

  const AddToFront = [item].concat(newArray);
  return AddToFront;
};

export const overiedLastInput = (data, item) => {
  if (data.length === 1) {
    return [item];
  }

  const clone = copyArray(data);
  clone.pop();

  const AddToLast = clone.concat(item);
  return AddToLast;
};
