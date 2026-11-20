
import { useState } from "react";
import { Coffee, BedDouble, Gift, type LucideIcon } from "lucide-react";

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  icon: LucideIcon;
}

const rewards: Reward[] = [
  {
    id: 1,
    name: "Complimentary Breakfast",
    description: "Enjoy a complimentary breakfast during your stay.",
    points: 1000,
    icon: Coffee,
  },
  {
    id: 2,
    name: "Room Upgrade",
    description: "Upgrade your room subject to availability.",
    points: 2000,
    icon: BedDouble,
  },
  {
    id: 3,
    name: "Welcome Gift",
    description: "Receive a special welcome gift.",
    points: 1500,
    icon: Gift,
  },
];

function Rewards() {
  const [message, setMessage] = useState("");
  const [selectedReward, setSelectedReward] = useState("");

  // Demonstration balance. Live loyalty account integration is not connected.
  const loyaltyPoints = 2450;

  const nextReward = rewards
    .filter((reward) => reward.points > loyaltyPoints)
    .sort((a, b) => a.points - b.points)[0];

  const progress = nextReward
    ? Math.min((loyaltyPoints / nextReward.points) * 100, 100)
    : 100;

  function handleRedeem(reward: Reward) {
    setSelectedReward(reward.name);

    if (loyaltyPoints < reward.points) {
      setMessage(
        `You need ${(
          reward.points - loyaltyPoints
        ).toLocaleString("en-NG")} more points to redeem ${reward.name}.`
      );
      return;
    }

    setMessage(
      `${reward.name} is eligible for redemption. Actual reward redemption is not yet connected.`
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">GUEST BENEFITS</p>
        <h1>Loyalty & Rewards</h1>
        <p className="muted">
          Enjoy more benefits every time you stay with us.
        </p>
      </div>

      <div className="rewards-card">
        <p>YOUR DEMO LOYALTY BALANCE</p>
        <h2>{loyaltyPoints.toLocaleString("en-NG")} Points</h2>
        <span>GrandStay Rewards Member</span>

        <div className="rewards-progress">
          <div className="progress-heading">
            <span>Next reward progress</span>
            <strong>{Math.round(progress)}%</strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Progress toward next reward"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <small>
            {nextReward
              ? `${(
                  nextReward.points - loyaltyPoints
                ).toLocaleString("en-NG")} points to ${nextReward.name}`
              : "You have enough points for all available rewards!"}
          </small>
        </div>
      </div>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXCLUSIVE BENEFITS</p>
            <h2>Available Rewards</h2>
          </div>
        </div>

        <div className="services-grid">
          {rewards.map((reward) => {
            const eligible = loyaltyPoints >= reward.points;

            return (
              <div className="service-card reward-item" key={reward.id}>
                <span className="service-icon"><reward.icon size={25} strokeWidth={1.8} /></span>

                <strong>{reward.name}</strong>

                <p>{reward.description}</p>

                <small>
                  {reward.points.toLocaleString("en-NG")} points
                </small>

                <button
                  type="button"
                  className="primary-button reward-button"
                  onClick={() => handleRedeem(reward)}
                >
                  {eligible ? "Redeem Reward" : "View Requirements"}
                </button>
              </div>
            );
          })}
        </div>

        {message && (
          <p className="form-message success-message" role="status">
            {message}
          </p>
        )}

        {selectedReward && (
          <p className="muted">
            Selected reward: {selectedReward}
          </p>
        )}
      </section>

      <p className="muted rewards-note">
        Note: Loyalty points and redemption eligibility are demonstration
        data. Live account balances and reward processing require backend
        integration.
      </p>
    </div>
  );
}

export default Rewards;
