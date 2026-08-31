import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { AppSkeleton } from 'src/components/templates';
import gtm from 'src/lib/gtm';
import AddressDetailInfo from 'src/pages/address/components/AddressDetailInfo';
import { AddressDetailTables } from 'src/pages/address/components/AddressDetailTables';
import { selectAddressDetail, selectAddressDetailError, selectAddressDetailLoading } from 'src/selectors/address';
import { getAddressDetail } from 'src/slices/entities/address';
import { useSelector } from 'src/store';
import { EulerError } from 'src/ui/EulerError';
import { EulerLoading } from 'src/ui/EulerLoading';
import { PageTitle } from 'src/ui/PageTitle';

const AddressDetails: FC = React.memo(() => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { addressId } = useParams();
  const loading = useSelector(selectAddressDetailLoading);
  const error = useSelector(selectAddressDetailError);
  const addressDetail = useSelector(selectAddressDetail);

  useEffect(() => {
    gtm.push({ event: 'user_view_adress_detail', category: 'Adresses', action: 'User view adress detail' });
  }, [location.pathname]);

  useEffect(() => {
    dispatch(getAddressDetail(addressId));
  }, [addressId]);

  return (
    <AppSkeleton>
      <PageTitle pageTitle="Address Detail" />
      {loading ? <EulerLoading /> : null}
      {error ? <EulerError error={error} /> : null}
      {addressDetail ? (
        <>
          <AddressDetailInfo />
          <AddressDetailTables />
        </>
      ) : null}
    </AppSkeleton>
  );
});

export default AddressDetails;
