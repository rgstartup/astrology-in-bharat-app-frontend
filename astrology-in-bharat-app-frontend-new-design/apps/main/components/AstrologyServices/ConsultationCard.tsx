import React from 'react';

interface ConsultationCardProps {
    item: {
        id: number;
        image: string;
        title: string;
    };
    onClick?: (item: any) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ item, onClick }) => {
    return (
        <div className="services-card cursor-pointer" onClick={() => onClick && onClick(item)}>
            <img
                src={item.image}
                alt={item.title}
            />
            <h4>{item.title}</h4>
        </div>
    )
}

export default ConsultationCard;
