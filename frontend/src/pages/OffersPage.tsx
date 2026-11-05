import ApplicationForm from "../components/ApplicationForm.tsx";
import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import OfferTable from "../components/OfferTable.tsx";
import { useOffers } from "../hooks/useOffers.ts";
import { useApplications } from "../hooks/useApplications.ts";
import type { User } from "../models/user.ts";

interface OffersPageProps {
  user: User;
  token: string;
  onUnauthorized: () => void;
}

const DESCRIPTIONS = {
  ADMIN: "Toutes les offres, tous statuts confondus.",
  STUDENT: "Les offres publiées.",
  CONTACT: "Les offres que vous avez déposées.",
} as const;

const OffersPage = ({ user, token, onUnauthorized }: OffersPageProps) => {
  const { offers, isLoading, error } = useOffers(token, onUnauthorized);
  const {
    applications,
    isLoading: applicationsLoading,
    error: applicationsError,
    apply,
  } = useApplications(token, onUnauthorized, user.kind === "STUDENT");

  const renderContent = () => {
    if (error) return <ErrorState message={error} />;
    if (user.kind === "STUDENT" && applicationsError) {
      return <ErrorState message={applicationsError} />;
    }
    if (isLoading) return <LoadingState />;
    if (offers.length === 0) return <EmptyState message="Aucune offre à afficher." />;
    return (
      <>
        <p className="result-count">
          {offers.length} offre{offers.length > 1 ? "s" : ""}
        </p>
        <OfferTable offers={offers} />
        {user.kind === "STUDENT" && (
          <div className="offer-applications">
            <h2>Candidater</h2>
            {applicationsLoading ? (
              <LoadingState message="Chargement de vos candidatures…" />
            ) : (
              offers.map((offer) => {
                const application = applications.find((item) => item.offerId === offer.id);
                return (
                  <div key={offer.id}>
                    <h3>{offer.title}</h3>
                    {application === undefined || application.status === "WITHDRAWN" ? (
                      <ApplicationForm onSubmit={(message) => apply(offer.id, message)} />
                    ) : (
                      <p>
                        Candidature :{" "}
                        {application.status === "IN_PROGRESS" ? "En cours" : "Traitée"}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <section>
      <h1>Offres de stage</h1>
      <p>{DESCRIPTIONS[user.kind]}</p>
      {renderContent()}
    </section>
  );
};

export default OffersPage;
